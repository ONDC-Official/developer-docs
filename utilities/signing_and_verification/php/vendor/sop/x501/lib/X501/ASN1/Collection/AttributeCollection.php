<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\Collection;

use Sop\ASN1\Type\Structure;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\X501\ASN1\Attribute;
use Sop\X501\ASN1\AttributeType;
use Sop\X501\ASN1\AttributeValue\AttributeValue;

/**
 * Base class for X.501 attribute containers.
 *
 * Implements methods for Countable and IteratorAggregate interfaces.
 */
abstract class AttributeCollection implements \Countable, \IteratorAggregate
{
    /**
     * Array of attributes.
     *
     * Always with consecutive indices.
     *
     * @var Attribute[]
     */
    protected $_attributes;

    /**
     * Constructor.
     *
     * @param Attribute ...$attribs List of attributes
     */
    public function __construct(Attribute ...$attribs)
    {
        $this->_attributes = $attribs;
    }

    /**
     * Initialize from attribute values.
     *
     * @param AttributeValue ...$values List of attribute values
     *
     * @return static
     */
    public static function fromAttributeValues(AttributeValue ...$values): self
    {
        return new static(...array_map(
            function (AttributeValue $value) {
                return $value->toAttribute();
            }, $values));
    }

    /**
     * Check whether attribute is present.
     *
     * @param string $name OID or attribute name
     *
     * @return bool
     */
    public function has(string $name): bool
    {
        return null !== $this->_findFirst($name);
    }

    /**
     * Get first attribute by OID or attribute name.
     *
     * @param string $name OID or attribute name
     *
     * @throws \UnexpectedValueException if attribute is not present
     *
     * @return Attribute
     */
    public function firstOf(string $name): Attribute
    {
        $attr = $this->_findFirst($name);
        if (!$attr) {
            throw new \UnexpectedValueException("No {$name} attribute.");
        }
        return $attr;
    }

    /**
     * Get all attributes of given name.
     *
     * @param string $name OID or attribute name
     *
     * @return Attribute[]
     */
    public function allOf(string $name): array
    {
        $oid = AttributeType::attrNameToOID($name);
        return array_values(
            array_filter($this->_attributes,
                function (Attribute $attr) use ($oid) {
                    return $attr->oid() === $oid;
                }));
    }

    /**
     * Get all attributes.
     *
     * @return Attribute[]
     */
    public function all(): array
    {
        return $this->_attributes;
    }

    /**
     * Get self with additional attributes added.
     *
     * @param Attribute ...$attribs List of attributes to add
     *
     * @return self
     */
    public function withAdditional(Attribute ...$attribs): self
    {
        $obj = clone $this;
        foreach ($attribs as $attr) {
            $obj->_attributes[] = $attr;
        }
        return $obj;
    }

    /**
     * Get self with single unique attribute added.
     *
     * All previous attributes of the same type are removed.
     *
     * @param Attribute $attr Attribute to add
     *
     * @return self
     */
    public function withUnique(Attribute $attr): self
    {
        $attribs = array_values(
            array_filter($this->_attributes,
                function (Attribute $a) use ($attr) {
                    return $a->oid() !== $attr->oid();
                }));
        $attribs[] = $attr;
        $obj = clone $this;
        $obj->_attributes = $attribs;
        return $obj;
    }

    /**
     * Get number of attributes.
     *
     * @see \Countable::count()
     *
     * @return int
     */
    public function count(): int
    {
        return count($this->_attributes);
    }

    /**
     * Get iterator for attributes.
     *
     * @see \IteratorAggregate::getIterator()
     *
     * @return \ArrayIterator|Attribute[]
     */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->_attributes);
    }

    /**
     * Find first attribute of given name or OID.
     *
     * @param string $name OID or attribute name
     *
     * @return null|Attribute
     */
    protected function _findFirst(string $name): ?Attribute
    {
        $oid = AttributeType::attrNameToOID($name);
        foreach ($this->_attributes as $attr) {
            if ($attr->oid() === $oid) {
                return $attr;
            }
        }
        return null;
    }

    /**
     * Initialize from ASN.1 constructed element.
     *
     * @param Structure $struct ASN.1 structure
     *
     * @return static
     */
    protected static function _fromASN1Structure(Structure $struct): self
    {
        return new static(...array_map(
            function (UnspecifiedType $el) {
                return static::_castAttributeValues(
                    Attribute::fromASN1($el->asSequence()));
            }, $struct->elements()));
    }

    /**
     * Cast Attribute's AttributeValues to implementation specific objects.
     *
     * Overridden in derived classes.
     *
     * @param Attribute $attribute Attribute to cast
     *
     * @return Attribute
     */
    protected static function _castAttributeValues(Attribute $attribute): Attribute
    {
        // pass through by default
        return $attribute;
    }
}
