<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1;

use Sop\ASN1\Type\Constructed\Set;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\X501\ASN1\AttributeValue\AttributeValue;

/**
 * Implements *RelativeDistinguishedName* ASN.1 type.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x501/2012/InformationFramework.html#InformationFramework.RelativeDistinguishedName
 */
class RDN implements \Countable, \IteratorAggregate
{
    /**
     * Attributes.
     *
     * @var AttributeTypeAndValue[]
     */
    protected $_attribs;

    /**
     * Constructor.
     *
     * @param AttributeTypeAndValue ...$attribs One or more attributes
     */
    public function __construct(AttributeTypeAndValue ...$attribs)
    {
        if (!count($attribs)) {
            throw new \UnexpectedValueException(
                'RDN must have at least one AttributeTypeAndValue.');
        }
        $this->_attribs = $attribs;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->toString();
    }

    /**
     * Convenience method to initialize RDN from AttributeValue objects.
     *
     * @param AttributeValue ...$values One or more attributes
     *
     * @return self
     */
    public static function fromAttributeValues(AttributeValue ...$values): self
    {
        $attribs = array_map(
            function (AttributeValue $value) {
                return new AttributeTypeAndValue(
                    new AttributeType($value->oid()), $value);
            }, $values);
        return new self(...$attribs);
    }

    /**
     * Initialize from ASN.1.
     *
     * @param Set $set
     *
     * @return self
     */
    public static function fromASN1(Set $set): self
    {
        $attribs = array_map(
            function (UnspecifiedType $el) {
                return AttributeTypeAndValue::fromASN1($el->asSequence());
            }, $set->elements());
        return new self(...$attribs);
    }

    /**
     * Generate ASN.1 structure.
     *
     * @return Set
     */
    public function toASN1(): Set
    {
        $elements = array_map(
            function (AttributeTypeAndValue $tv) {
                return $tv->toASN1();
            }, $this->_attribs);
        $set = new Set(...$elements);
        return $set->sortedSetOf();
    }

    /**
     * Get name-component string conforming to RFC 2253.
     *
     * @see https://tools.ietf.org/html/rfc2253#section-2.2
     *
     * @return string
     */
    public function toString(): string
    {
        $parts = array_map(
            function (AttributeTypeAndValue $tv) {
                return $tv->toString();
            }, $this->_attribs);
        return implode('+', $parts);
    }

    /**
     * Check whether RDN is semantically equal to other.
     *
     * @param RDN $other Object to compare to
     *
     * @return bool
     */
    public function equals(RDN $other): bool
    {
        // if attribute count doesn't match
        if (count($this) !== count($other)) {
            return false;
        }
        $attribs1 = $this->_attribs;
        $attribs2 = $other->_attribs;
        // if there's multiple attributes, sort using SET OF rules
        if (count($attribs1) > 1) {
            $attribs1 = self::fromASN1($this->toASN1())->_attribs;
            $attribs2 = self::fromASN1($other->toASN1())->_attribs;
        }
        for ($i = count($attribs1) - 1; $i >= 0; --$i) {
            $tv1 = $attribs1[$i];
            $tv2 = $attribs2[$i];
            if (!$tv1->equals($tv2)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all AttributeTypeAndValue objects.
     *
     * @return AttributeTypeAndValue[]
     */
    public function all(): array
    {
        return $this->_attribs;
    }

    /**
     * Get all AttributeTypeAndValue objects of the given attribute type.
     *
     * @param string $name Attribute OID or name
     *
     * @return AttributeTypeAndValue[]
     */
    public function allOf(string $name): array
    {
        $oid = AttributeType::attrNameToOID($name);
        $attribs = array_filter($this->_attribs,
            function (AttributeTypeAndValue $tv) use ($oid) {
                return $tv->oid() === $oid;
            });
        return array_values($attribs);
    }

    /**
     * @see \Countable::count()
     *
     * @return int
     */
    public function count(): int
    {
        return count($this->_attribs);
    }

    /**
     * @see \IteratorAggregate::getIterator()
     *
     * @return \ArrayIterator
     */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->_attribs);
    }
}
