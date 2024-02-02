<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Signature;

use Sop\ASN1\Type\Primitive\BitString;

/**
 * Implements RSA signature value.
 *
 * @todo Implement signature parsing
 *
 * @see https://tools.ietf.org/html/rfc2313#section-10
 */
class RSASignature extends Signature
{
    /**
     * Signature value *S*.
     *
     * @var string
     */
    private $_signature;

    /**
     * Constructor.
     */
    protected function __construct()
    {
    }

    /**
     * Initialize from RSA signature *S*.
     *
     * Signature value *S* is the result of last step in RSA signature
     * process defined in PKCS #1.
     *
     * @see https://tools.ietf.org/html/rfc2313#section-10.1.4
     *
     * @param string $signature Signature bits
     *
     * @return self
     */
    public static function fromSignatureString(string $signature): Signature
    {
        $obj = new self();
        $obj->_signature = strval($signature);
        return $obj;
    }

    /**
     * {@inheritdoc}
     */
    public function bitString(): BitString
    {
        return new BitString($this->_signature);
    }
}
