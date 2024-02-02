<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Signature;

use Sop\ASN1\Type\Constructed\Sequence;
use Sop\ASN1\Type\Primitive\BitString;
use Sop\ASN1\Type\Primitive\Integer;
use Sop\ASN1\Type\UnspecifiedType;

/**
 * Implements ECDSA signature value.
 *
 * ECDSA signature is represented as a `ECDSA-Sig-Value` ASN.1 type.
 *
 * @see https://tools.ietf.org/html/rfc3278#section-8.2
 */
class ECSignature extends Signature
{
    /**
     * r-value as a base 10 integer.
     *
     * @var string
     */
    protected $_r;

    /**
     * s-value as a base 10 integer.
     *
     * @var string
     */
    protected $_s;

    /**
     * Constructor.
     *
     * @param int|string $r Signature's `r` value
     * @param int|string $s Signature's `s` value
     */
    public function __construct($r, $s)
    {
        $this->_r = strval($r);
        $this->_s = strval($s);
    }

    /**
     * Initialize from ASN.1.
     */
    public static function fromASN1(Sequence $seq): self
    {
        $r = $seq->at(0)->asInteger()->number();
        $s = $seq->at(1)->asInteger()->number();
        return new self($r, $s);
    }

    /**
     * Initialize from DER.
     */
    public static function fromDER(string $data): self
    {
        return self::fromASN1(UnspecifiedType::fromDER($data)->asSequence());
    }

    /**
     * Get the r-value.
     *
     * @return string Base 10 integer string
     */
    public function r(): string
    {
        return $this->_r;
    }

    /**
     * Get the s-value.
     *
     * @return string Base 10 integer string
     */
    public function s(): string
    {
        return $this->_s;
    }

    /**
     * Generate ASN.1 structure.
     */
    public function toASN1(): Sequence
    {
        return new Sequence(new Integer($this->_r), new Integer($this->_s));
    }

    /**
     * Get DER encoding of the signature.
     */
    public function toDER(): string
    {
        return $this->toASN1()->toDER();
    }

    /**
     * {@inheritdoc}
     */
    public function bitString(): BitString
    {
        return new BitString($this->toDER());
    }
}
