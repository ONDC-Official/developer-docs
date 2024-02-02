<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\AttributeValue;

use Sop\ASN1\Element;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\X501\ASN1\Attribute;
use Sop\X501\ASN1\AttributeType;
use Sop\X501\ASN1\AttributeTypeAndValue;
use Sop\X501\MatchingRule\MatchingRule;

/**
 * Base class for attribute values.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x501/2012/InformationFramework.html#InformationFramework.AttributeValue
 */
abstract class AttributeValue
{
    /**
     * Mapping from attribute type OID to attribute value class name.
     *
     * @internal
     *
     * @var array
     */
    const MAP_OID_TO_CLASS = [
        AttributeType::OID_COMMON_NAME => CommonNameValue::class,
        AttributeType::OID_SURNAME => SurnameValue::class,
        AttributeType::OID_SERIAL_NUMBER => SerialNumberValue::class,
        AttributeType::OID_COUNTRY_NAME => CountryNameValue::class,
        AttributeType::OID_LOCALITY_NAME => LocalityNameValue::class,
        AttributeType::OID_STATE_OR_PROVINCE_NAME => StateOrProvinceNameValue::class,
        AttributeType::OID_ORGANIZATION_NAME => OrganizationNameValue::class,
        AttributeType::OID_ORGANIZATIONAL_UNIT_NAME => OrganizationalUnitNameValue::class,
        AttributeType::OID_TITLE => TitleValue::class,
        AttributeType::OID_DESCRIPTION => DescriptionValue::class,
        AttributeType::OID_NAME => NameValue::class,
        AttributeType::OID_GIVEN_NAME => GivenNameValue::class,
        AttributeType::OID_PSEUDONYM => PseudonymValue::class,
    ];

    /**
     * OID of the attribute type.
     *
     * @var string
     */
    protected $_oid;

    /**
     * Get attribute value as an UTF-8 encoded string.
     *
     * @return string
     */
    public function __toString()
    {
        return $this->_transcodedString();
    }

    /**
     * Generate ASN.1 element.
     *
     * @return Element
     */
    abstract public function toASN1(): Element;

    /**
     * Get attribute value as a string.
     *
     * @return string
     */
    abstract public function stringValue(): string;

    /**
     * Get matching rule for equality comparison.
     *
     * @return MatchingRule
     */
    abstract public function equalityMatchingRule(): MatchingRule;

    /**
     * Get attribute value as a string conforming to RFC 2253.
     *
     * @see https://tools.ietf.org/html/rfc2253#section-2.4
     *
     * @return string
     */
    abstract public function rfc2253String(): string;

    /**
     * Initialize from ASN.1.
     *
     * @param UnspecifiedType $el
     *
     * @return self
     */
    public static function fromASN1(UnspecifiedType $el): AttributeValue
    {
        throw new \BadMethodCallException(
            'ASN.1 parsing must be implemented in a concrete class.');
    }

    /**
     * Initialize from ASN.1 with given OID hint.
     *
     * @param string          $oid Attribute's OID
     * @param UnspecifiedType $el
     *
     * @return self
     */
    public static function fromASN1ByOID(string $oid, UnspecifiedType $el): self
    {
        if (!array_key_exists($oid, self::MAP_OID_TO_CLASS)) {
            return new UnknownAttributeValue($oid, $el->asElement());
        }
        $cls = self::MAP_OID_TO_CLASS[$oid];
        return $cls::fromASN1($el);
    }

    /**
     * Initialize from another AttributeValue.
     *
     * This method is generally used to cast UnknownAttributeValue to
     * specific object when class is declared outside this package.
     *
     * @param self $obj Instance of AttributeValue
     *
     * @return self
     */
    public static function fromSelf(self $obj): self
    {
        return static::fromASN1($obj->toASN1()->asUnspecified());
    }

    /**
     * Get attribute type's OID.
     *
     * @return string
     */
    public function oid(): string
    {
        return $this->_oid;
    }

    /**
     * Get Attribute object with this as a single value.
     *
     * @return Attribute
     */
    public function toAttribute(): Attribute
    {
        return Attribute::fromAttributeValues($this);
    }

    /**
     * Get AttributeTypeAndValue object with this as a value.
     *
     * @return AttributeTypeAndValue
     */
    public function toAttributeTypeAndValue(): AttributeTypeAndValue
    {
        return AttributeTypeAndValue::fromAttributeValue($this);
    }

    /**
     * Get attribute value as an UTF-8 string conforming to RFC 4518.
     *
     * @see https://tools.ietf.org/html/rfc4518#section-2.1
     *
     * @return string
     */
    abstract protected function _transcodedString(): string;
}
