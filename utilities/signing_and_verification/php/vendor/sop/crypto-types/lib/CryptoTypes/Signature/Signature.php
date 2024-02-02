<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Signature;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\Ed25519AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\Ed448AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\AlgorithmIdentifier\Signature\ECSignatureAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Signature\RSASignatureAlgorithmIdentifier;

/**
 * Base class for signature values.
 */
abstract class Signature
{
    /**
     * Get the signature as a BitString.
     */
    abstract public function bitString(): BitString;

    /**
     * Get signature object by signature data and used algorithm.
     *
     * @param string                  $data Signature value
     * @param AlgorithmIdentifierType $algo Algorithm identifier
     *
     * @return self
     */
    public static function fromSignatureData(string $data,
        AlgorithmIdentifierType $algo): Signature
    {
        if ($algo instanceof RSASignatureAlgorithmIdentifier) {
            return RSASignature::fromSignatureString($data);
        }
        if ($algo instanceof ECSignatureAlgorithmIdentifier) {
            return ECSignature::fromDER($data);
        }
        if ($algo instanceof Ed25519AlgorithmIdentifier) {
            return new Ed25519Signature($data);
        }
        if ($algo instanceof Ed448AlgorithmIdentifier) {
            return new Ed448Signature($data);
        }
        return new GenericSignature(new BitString($data), $algo);
    }
}
