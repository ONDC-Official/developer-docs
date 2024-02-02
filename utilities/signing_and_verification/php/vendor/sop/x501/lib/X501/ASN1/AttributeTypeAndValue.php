<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1;

use Sop\ASN1\Type\Constructed\Sequence;
use Sop\X501\ASN1\AttributeValue\AttributeValue;
use Sop\X501\ASN1\Feature\TypedAttribute;

/**
 * Implements *AttributeTypeAndValue* ASN.1 type.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x501/2012/InformationFramework.html#InformationFramework.AttributeTypeAndValue
 */
class AttributeTypeAndValue
{
    use TypedAttribute;

    /**
     * Attribute value.
     *
     * @var AttributeValue
     */
    protected $_value;

    /**
     * Constructor.
     *
     * @param AttributeType  $type  Attribute type
     * @param AttributeValue $value Attribute value
     */
    public function __construct(AttributeType $type, AttributeValue $value)
    {
        $this->_type = $type;
        $this->_value = $value;
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
        $type = AttributeType::fromASN1($seq->at(0)->asObjectIdentifier());
        $value = AttributeValue::fromASN1ByOID($type->oid(), $seq->at(1));
        return new self($type, $value);
    }

    /**
     * Convenience method to initialize from attribute value.
     *
     * @param AttributeValue $value Attribute value
     *
     * @return self
     */
    public static function fromAttributeValue(AttributeValue $value): self
    {
        return new self(new AttributeType($value->oid()), $value);
    }

    /**
     * Get attribute value.
     *
     * @return AttributeValue
     */
    public function value(): AttributeValue
    {
        return $this->_value;
    }

    /**
     * Generate ASN.1 structure.
     *
     * @return Sequence
     */
    public function toASN1(): Sequence
    {
        return new Sequence($this->_type->toASN1(), $this->_value->toASN1());
    }

    /**
     * Get attributeTypeAndValue string conforming to RFC 2253.
     *
     * @see https://tools.ietf.org/html/rfc2253#section-2.3
     *
     * @return string
     */
    public function toString(): string
    {
        return $this->_type->typeName() . '=' . $this->_value->rfc2253String();
    }

    /**
     * Check whether attribute is semantically equal to other.
     *
     * @param AttributeTypeAndValue $other Object to compare to
     *
     * @return bool
     */
    public function equals(AttributeTypeAndValue $other): bool
    {
        // check that attribute types match
        if ($this->oid() !== $other->oid()) {
            return false;
        }
        $matcher = $this->_value->equalityMatchingRule();
        $result = $matcher->compare($this->_value->stringValue(),
            $other->_value->stringValue());
        // match
        if ($result) {
            return true;
        }
        // no match or Undefined
        return false;
    }
}
