<?php

declare(strict_types = 1);

namespace Sop\X501\DN;

use Sop\ASN1\Element;
use Sop\ASN1\Exception\DecodeException;

/**
 * Distinguished Name parsing conforming to RFC 2253 and RFC 1779.
 *
 * @see https://tools.ietf.org/html/rfc1779
 * @see https://tools.ietf.org/html/rfc2253
 */
class DNParser
{
    /**
     * RFC 2253 special characters.
     *
     * @var string
     */
    const SPECIAL_CHARS = ',=+<>#;';

    /**
     * DN string.
     *
     * @var string
     */
    private $_dn;

    /**
     * DN string length.
     *
     * @var int
     */
    private $_len;

    /**
     * Constructor.
     *
     * @param string $dn Distinguised name
     */
    protected function __construct(string $dn)
    {
        $this->_dn = $dn;
        $this->_len = strlen($dn);
    }

    /**
     * Parse distinguished name string to name-components.
     *
     * @param string $dn
     *
     * @return array
     */
    public static function parseString(string $dn): array
    {
        $parser = new self($dn);
        return $parser->parse();
    }

    /**
     * Escape a AttributeValue string conforming to RFC 2253.
     *
     * @see https://tools.ietf.org/html/rfc2253#section-2.4
     *
     * @param string $str
     *
     * @return string
     */
    public static function escapeString(string $str): string
    {
        // one of the characters ",", "+", """, "\", "<", ">" or ";"
        $str = preg_replace('/([,\+"\\\<\>;])/u', '\\\\$1', $str);
        // a space character occurring at the end of the string
        $str = preg_replace('/( )$/u', '\\\\$1', $str);
        // a space or "#" character occurring at the beginning of the string
        $str = preg_replace('/^([ #])/u', '\\\\$1', $str);
        // implementation specific special characters
        $str = preg_replace_callback('/([\pC])/u',
            function ($m) {
                $octets = str_split(bin2hex($m[1]), 2);
                return implode('',
                    array_map(
                        function ($octet) {
                            return '\\' . strtoupper($octet);
                        }, $octets));
            }, $str);
        return $str;
    }

    /**
     * Parse DN to name-components.
     *
     * @throws \RuntimeException
     *
     * @return array
     */
    protected function parse(): array
    {
        $offset = 0;
        $name = $this->_parseName($offset);
        if ($offset < $this->_len) {
            $remains = substr($this->_dn, $offset);
            throw new \UnexpectedValueException(
                'Parser finished before the end of string' .
                     ", remaining: '{$remains}'.");
        }
        return $name;
    }

    /**
     * Parse 'name'.
     *
     * name-component *("," name-component)
     *
     * @param int $offset
     *
     * @return array Array of name-components
     */
    private function _parseName(int &$offset): array
    {
        $idx = $offset;
        $names = [];
        while ($idx < $this->_len) {
            $names[] = $this->_parseNameComponent($idx);
            if ($idx >= $this->_len) {
                break;
            }
            $this->_skipWs($idx);
            if (',' != $this->_dn[$idx] && ';' != $this->_dn[$idx]) {
                break;
            }
            ++$idx;
            $this->_skipWs($idx);
        }
        $offset = $idx;
        return array_reverse($names);
    }

    /**
     * Parse 'name-component'.
     *
     * attributeTypeAndValue *("+" attributeTypeAndValue)
     *
     * @param int $offset
     *
     * @return array Array of [type, value] tuples
     */
    private function _parseNameComponent(int &$offset): array
    {
        $idx = $offset;
        $tvpairs = [];
        while ($idx < $this->_len) {
            $tvpairs[] = $this->_parseAttrTypeAndValue($idx);
            $this->_skipWs($idx);
            if ($idx >= $this->_len || '+' != $this->_dn[$idx]) {
                break;
            }
            ++$idx;
            $this->_skipWs($idx);
        }
        $offset = $idx;
        return $tvpairs;
    }

    /**
     * Parse 'attributeTypeAndValue'.
     *
     * attributeType "=" attributeValue
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return array A tuple of [type, value]. Value may be either a string or
     *               an Element, if it's encoded as hexstring.
     */
    private function _parseAttrTypeAndValue(int &$offset): array
    {
        $idx = $offset;
        $type = $this->_parseAttrType($idx);
        $this->_skipWs($idx);
        if ($idx >= $this->_len || '=' != $this->_dn[$idx++]) {
            throw new \UnexpectedValueException('Invalid type and value pair.');
        }
        $this->_skipWs($idx);
        // hexstring
        if ($idx < $this->_len && '#' == $this->_dn[$idx]) {
            ++$idx;
            $data = $this->_parseAttrHexValue($idx);
            try {
                $value = Element::fromDER($data);
            } catch (DecodeException $e) {
                throw new \UnexpectedValueException(
                    'Invalid DER encoding from hexstring.', 0, $e);
            }
        } else {
            $value = $this->_parseAttrStringValue($idx);
        }
        $offset = $idx;
        return [$type, $value];
    }

    /**
     * Parse 'attributeType'.
     *
     * (ALPHA 1*keychar) / oid
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parseAttrType(int &$offset): string
    {
        $idx = $offset;
        // dotted OID
        $type = $this->_regexMatch('/^(?:oid\.)?([0-9]+(?:\.[0-9]+)*)/i', $idx);
        if (null === $type) {
            // name
            $type = $this->_regexMatch('/^[a-z][a-z0-9\-]*/i', $idx);
            if (null === $type) {
                throw new \UnexpectedValueException('Invalid attribute type.');
            }
        }
        $offset = $idx;
        return $type;
    }

    /**
     * Parse 'attributeValue' of string type.
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parseAttrStringValue(int &$offset): string
    {
        $idx = $offset;
        if ($idx >= $this->_len) {
            return '';
        }
        if ('"' == $this->_dn[$idx]) { // quoted string
            $val = $this->_parseQuotedAttrString($idx);
        } else { // string
            $val = $this->_parseAttrString($idx);
        }
        $offset = $idx;
        return $val;
    }

    /**
     * Parse plain 'attributeValue' string.
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parseAttrString(int &$offset): string
    {
        $idx = $offset;
        $val = '';
        $wsidx = null;
        while ($idx < $this->_len) {
            $c = $this->_dn[$idx];
            // pair (escape sequence)
            if ('\\' == $c) {
                ++$idx;
                $val .= $this->_parsePairAfterSlash($idx);
                $wsidx = null;
                continue;
            }
            if ('"' == $c) {
                throw new \UnexpectedValueException('Unexpected quotation.');
            }
            if (false !== strpos(self::SPECIAL_CHARS, $c)) {
                break;
            }
            // keep track of the first consecutive whitespace
            if (' ' == $c) {
                if (null === $wsidx) {
                    $wsidx = $idx;
                }
            } else {
                $wsidx = null;
            }
            // stringchar
            $val .= $c;
            ++$idx;
        }
        // if there was non-escaped whitespace in the end of the value
        if (null !== $wsidx) {
            $val = substr($val, 0, -($idx - $wsidx));
        }
        $offset = $idx;
        return $val;
    }

    /**
     * Parse quoted 'attributeValue' string.
     *
     * @param int $offset Offset to starting quote
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parseQuotedAttrString(int &$offset): string
    {
        $idx = $offset + 1;
        $val = '';
        while ($idx < $this->_len) {
            $c = $this->_dn[$idx];
            if ('\\' == $c) { // pair
                ++$idx;
                $val .= $this->_parsePairAfterSlash($idx);
                continue;
            }
            if ('"' == $c) {
                ++$idx;
                break;
            }
            $val .= $c;
            ++$idx;
        }
        $offset = $idx;
        return $val;
    }

    /**
     * Parse 'attributeValue' of binary type.
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parseAttrHexValue(int &$offset): string
    {
        $idx = $offset;
        $hexstr = $this->_regexMatch('/^(?:[0-9a-f]{2})+/i', $idx);
        if (null === $hexstr) {
            throw new \UnexpectedValueException('Invalid hexstring.');
        }
        $data = hex2bin($hexstr);
        $offset = $idx;
        return $data;
    }

    /**
     * Parse 'pair' after leading slash.
     *
     * @param int $offset
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private function _parsePairAfterSlash(int &$offset): string
    {
        $idx = $offset;
        if ($idx >= $this->_len) {
            throw new \UnexpectedValueException(
                'Unexpected end of escape sequence.');
        }
        $c = $this->_dn[$idx++];
        // special | \ | " | SPACE
        if (false !== strpos(self::SPECIAL_CHARS . '\\" ', $c)) {
            $val = $c;
        } else { // hexpair
            if ($idx >= $this->_len) {
                throw new \UnexpectedValueException('Unexpected end of hexpair.');
            }
            $val = @hex2bin($c . $this->_dn[$idx++]);
            if (false === $val) {
                throw new \UnexpectedValueException('Invalid hexpair.');
            }
        }
        $offset = $idx;
        return $val;
    }

    /**
     * Match DN to pattern and extract the last capture group.
     *
     * Updates offset to fully matched pattern.
     *
     * @param string $pattern
     * @param int    $offset
     *
     * @return null|string Null if pattern doesn't match
     */
    private function _regexMatch(string $pattern, int &$offset): ?string
    {
        $idx = $offset;
        if (!preg_match($pattern, substr($this->_dn, $idx), $match)) {
            return null;
        }
        $idx += strlen($match[0]);
        $offset = $idx;
        return end($match);
    }

    /**
     * Skip consecutive spaces.
     *
     * @param int $offset
     */
    private function _skipWs(int &$offset): void
    {
        $idx = $offset;
        while ($idx < $this->_len) {
            if (' ' != $this->_dn[$idx]) {
                break;
            }
            ++$idx;
        }
        $offset = $idx;
    }
}
