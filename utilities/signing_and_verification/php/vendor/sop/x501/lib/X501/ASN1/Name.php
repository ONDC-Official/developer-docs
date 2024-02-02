<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Constructed\Sequence;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\X501\ASN1\AttributeValue\AttributeValue;
use Sop\X501\DN\DNParser;

/**
 * Implements *Name* ASN.1 type.
 *
 * Since *Name* is a CHOICE only supporting *RDNSequence* type,
 * this class implements *RDNSequence* semantics as well.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x501/2012/InformationFramework.html#InformationFramework.Name
 */
class Name implements \Countable, \IteratorAggregate
{
    /**
     * Relative distinguished name components.
     *
     * @var RDN[]
     */
    protected $_rdns;

    /**
     * Constructor.
     *
     * @param RDN ...$rdns RDN components
     */
    public function __construct(RDN ...$rdns)
    {
        $this->_rdns = $rdns;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->toString();
    }

    /**
     * Initialize from ASN.1.
     *
     * @param Sequence $seq
     *
     * @return self
     */
    public static function fromASN1(Sequence $seq): self
    {
        $rdns = array_map(
            function (UnspecifiedType $el) {
                return RDN::fromASN1($el->asSet());
            }, $seq->elements());
        return new self(...$rdns);
    }

    /**
     * Initialize from distinguished name string.
     *
     * @see https://tools.ietf.org/html/rfc1779
     *
     * @param string $str
     *
     * @return self
     */
    public static function fromString(string $str): self
    {
        $rdns = [];
        foreach (DNParser::parseString($str) as $nameComponent) {
            $attribs = [];
            foreach ($nameComponent as [$name, $val]) {
                $type = AttributeType::fromName($name);
                // hexstrings are parsed to ASN.1 elements
                if ($val instanceof Element) {
                    $el = $val;
                } else {
                    $el = AttributeType::asn1StringForType($type->oid(), $val);
                }
                $value = AttributeValue::fromASN1ByOID($type->oid(),
                    $el->asUnspecified());
                $attribs[] = new AttributeTypeAndValue($type, $value);
            }
            $rdns[] = new RDN(...$attribs);
        }
        return new self(...$rdns);
    }

    /**
     * Generate ASN.1 structure.
     *
     * @return Sequence
     */
    public function toASN1(): Sequence
    {
        $elements = array_map(
            function (RDN $rdn) {
                return $rdn->toASN1();
            }, $this->_rdns);
        return new Sequence(...$elements);
    }

    /**
     * Get distinguised name string conforming to RFC 2253.
     *
     * @see https://tools.ietf.org/html/rfc2253#section-2.1
     *
     * @return string
     */
    public function toString(): string
    {
        $parts = array_map(
            function (RDN $rdn) {
                return $rdn->toString();
            }, array_reverse($this->_rdns));
        return implode(',', $parts);
    }

    /**
     * Whether name is semantically equal to other.
     *
     * Comparison conforms to RFC 4518 string preparation algorithm.
     *
     * @see https://tools.ietf.org/html/rfc4518
     *
     * @param Name $other Object to compare to
     *
     * @return bool
     */
    public function equals(Name $other): bool
    {
        // if RDN count doesn't match
        if (count($this) !== count($other)) {
            return false;
        }
        for ($i = count($this) - 1; $i >= 0; --$i) {
            $rdn1 = $this->_rdns[$i];
            $rdn2 = $other->_rdns[$i];
            if (!$rdn1->equals($rdn2)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all RDN objects.
     *
     * @return RDN[]
     */
    public function all(): array
    {
        return $this->_rdns;
    }

    /**
     * Get the first AttributeValue of given type.
     *
     * Relative name components shall be traversed in encoding order, which is
     * reversed in regards to the string representation.
     * Multi-valued RDN with multiple attributes of the requested type is
     * ambiguous and shall throw an exception.
     *
     * @param string $name Attribute OID or name
     *
     * @throws \RuntimeException If attribute cannot be resolved
     *
     * @return AttributeValue
     */
    public function firstValueOf(string $name): AttributeValue
    {
        $oid = AttributeType::attrNameToOID($name);
        foreach ($this->_rdns as $rdn) {
            $tvs = $rdn->allOf($oid);
            if (count($tvs) > 1) {
                throw new \RangeException("RDN with multiple {$name} attributes.");
            }
            if (1 === count($tvs)) {
                return $tvs[0]->value();
            }
        }
        throw new \RangeException("Attribute {$name} not found.");
    }

    /**
     * @see \Countable::count()
     *
     * @return int
     */
    public function count(): int
    {
        return count($this->_rdns);
    }

    /**
     * Get the number of attributes of given type.
     *
     * @param string $name Attribute OID or name
     *
     * @return int
     */
    public function countOfType(string $name): int
    {
        $oid = AttributeType::attrNameToOID($name);
        return (int) array_sum(
            array_map(
                function (RDN $rdn) use ($oid): int {
                    return count($rdn->allOf($oid));
                }, $this->_rdns));
    }

    /**
     * @see \IteratorAggregate::getIterator()
     *
     * @return \ArrayIterator
     */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->_rdns);
    }
}
