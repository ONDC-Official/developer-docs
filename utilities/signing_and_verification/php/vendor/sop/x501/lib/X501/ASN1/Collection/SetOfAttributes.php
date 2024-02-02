<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\Collection;

use Sop\ASN1\Type\Constructed\Set;
use Sop\X501\ASN1\Attribute;

/**
 * Implements *Attributes* ASN.1 type as a *SET OF Attribute*.
 *
 * Used in *CertificationRequestInfo* and *OneAsymmetricKey*.
 *
 * @see https://tools.ietf.org/html/rfc2986#section-4
 * @see https://tools.ietf.org/html/rfc5958#section-2
 */
class SetOfAttributes extends AttributeCollection
{
    /**
     * Initialize from ASN.1.
     *
     * @param Set $set
     *
     * @return self
     */
    public static function fromASN1(Set $set): self
    {
        return static::_fromASN1Structure($set);
    }

    /**
     * Generate ASN.1 structure.
     *
     * @return Set
     */
    public function toASN1(): Set
    {
        $set = new Set(...array_map(
            function (Attribute $attr) {
                return $attr->toASN1();
            }, $this->_attributes));
        return $set->sortedSetOf();
    }
}
