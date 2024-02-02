<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\AttributeValue\Feature;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\BMPString;
use Sop\ASN1\Type\Primitive\PrintableString;
use Sop\ASN1\Type\Primitive\T61String;
use Sop\ASN1\Type\Primitive\UniversalString;
use Sop\ASN1\Type\Primitive\UTF8String;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\X501\ASN1\AttributeValue\AttributeValue;
use Sop\X501\DN\DNParser;
use Sop\X501\MatchingRule\CaseIgnoreMatch;
use Sop\X501\MatchingRule\MatchingRule;
use Sop\X501\StringPrep\TranscodeStep;

/**
 * Base class for attribute values having *(Unbounded)DirectoryString* as a syntax.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x520/2012/SelectedAttributeTypes.html#SelectedAttributeTypes.UnboundedDirectoryString
 */
abstract class DirectoryString extends AttributeValue
{
    /**
     * Teletex string syntax.
     *
     * @var int
     */
    const TELETEX = Element::TYPE_T61_STRING;

    /**
     * Printable string syntax.
     *
     * @var int
     */
    const PRINTABLE = Element::TYPE_PRINTABLE_STRING;

    /**
     * BMP string syntax.
     *
     * @var int
     */
    const BMP = Element::TYPE_BMP_STRING;

    /**
     * Universal string syntax.
     *
     * @var int
     */
    const UNIVERSAL = Element::TYPE_UNIVERSAL_STRING;

    /**
     * UTF-8 string syntax.
     *
     * @var int
     */
    const UTF8 = Element::TYPE_UTF8_STRING;

    /**
     * Mapping from syntax enumeration to ASN.1 class name.
     *
     * @internal
     *
     * @var array
     */
    const MAP_TAG_TO_CLASS = [
        self::TELETEX => T61String::class,
        self::PRINTABLE => PrintableString::class,
        self::UNIVERSAL => UniversalString::class,
        self::UTF8 => UTF8String::class,
        self::BMP => BMPString::class,
    ];

    /**
     * ASN.1 type tag for the chosen syntax.
     *
     * @var int
     */
    protected $_stringTag;

    /**
     * String value.
     *
     * @var string
     */
    protected $_string;

    /**
     * Constructor.
     *
     * @param string $value      String value
     * @param int    $string_tag Syntax choice
     */
    public function __construct(string $value, int $string_tag)
    {
        $this->_string = $value;
        $this->_stringTag = $string_tag;
    }

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1(UnspecifiedType $el): AttributeValue
    {
        $tag = $el->tag();
        self::_tagToASN1Class($tag);
        return new static($el->asString()->string(), $tag);
    }

    /**
     * {@inheritdoc}
     */
    public function toASN1(): Element
    {
        $cls = self::_tagToASN1Class($this->_stringTag);
        return new $cls($this->_string);
    }

    /**
     * {@inheritdoc}
     */
    public function stringValue(): string
    {
        return $this->_string;
    }

    /**
     * {@inheritdoc}
     */
    public function equalityMatchingRule(): MatchingRule
    {
        return new CaseIgnoreMatch($this->_stringTag);
    }

    /**
     * {@inheritdoc}
     */
    public function rfc2253String(): string
    {
        // TeletexString is encoded as binary
        if (self::TELETEX === $this->_stringTag) {
            return $this->_transcodedString();
        }
        return DNParser::escapeString($this->_transcodedString());
    }

    /**
     * {@inheritdoc}
     */
    protected function _transcodedString(): string
    {
        $step = new TranscodeStep($this->_stringTag);
        return $step->apply($this->_string);
    }

    /**
     * Get ASN.1 class name for given DirectoryString type tag.
     *
     * @param int $tag
     *
     * @throws \UnexpectedValueException
     *
     * @return string
     */
    private static function _tagToASN1Class(int $tag): string
    {
        if (!array_key_exists($tag, self::MAP_TAG_TO_CLASS)) {
            throw new \UnexpectedValueException(
                'Type ' . Element::tagToName($tag) .
                ' is not valid DirectoryString.');
        }
        return self::MAP_TAG_TO_CLASS[$tag];
    }
}
