<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Signature;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;

/**
 * Generic signature value container.
 */
class GenericSignature extends Signature
{
    /**
     * Signature value.
     *
     * @var BitString
     */
    private $_signature;

    /**
     * Signature algorithm.
     *
     * @var AlgorithmIdentifierType
     */
    private $_signatureAlgorithm;

    /**
     * Constructor.
     *
     * @param BitString               $signature Signature value
     * @param AlgorithmIdentifierType $algo      Algorithm identifier
     */
    public function __construct(BitString $signature, AlgorithmIdentifierType $algo)
    {
        $this->_signature = $signature;
        $this->_signatureAlgorithm = $algo;
    }

    /**
     * Get the signature algorithm.
     */
    public function signatureAlgorithm(): AlgorithmIdentifierType
    {
        return $this->_signatureAlgorithm;
    }

    /**
     * {@inheritdoc}
     */
    public function bitString(): BitString
    {
        return $this->_signature;
    }
}
