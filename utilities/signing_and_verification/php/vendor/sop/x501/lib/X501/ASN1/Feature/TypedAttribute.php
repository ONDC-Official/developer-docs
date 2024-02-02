<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\Feature;

use Sop\X501\ASN1\AttributeType;

/**
 * Trait for attributes having a type.
 */
trait TypedAttribute
{
    /**
     * Attribute type.
     *
     * @var AttributeType
     */
    protected $_type;

    /**
     * Get attribute type.
     *
     * @return AttributeType
     */
    public function type(): AttributeType
    {
        return $this->_type;
    }

    /**
     * Get OID of the attribute.
     *
     * @return string
     */
    public function oid(): string
    {
        return $this->_type->oid();
    }
}
