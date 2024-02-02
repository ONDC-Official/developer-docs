<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\Collection;

use Sop\ASN1\Type\Constructed\Sequence;
use Sop\X501\ASN1\Attribute;

/**
 * Implements *Attributes* ASN.1 type as a *SEQUENCE OF Attribute*.
 *
 * Used in *AttributeCertificateInfo*.
 *
 * @see https://tools.ietf.org/html/rfc5755#section-4.1
 * @see https://tools.ietf.org/html/rfc5755#section-4.2.7
 */
class SequenceOfAttributes extends AttributeCollection
{
    /**
     * Initialize from ASN.1.
     *
     * @param Sequence $seq
     *
     * @return self
     */
    public static function fromASN1(Sequence $seq): self
    {
        return static::_fromASN1Structure($seq);
    }

    /**
     * Generate ASN.1 structure.
     *
     * @return Sequence
     */
    public function toASN1(): Sequence
    {
        return new Sequence(...array_map(
            function (Attribute $attr) {
                return $attr->toASN1();
            }, $this->_attributes));
    }
}
