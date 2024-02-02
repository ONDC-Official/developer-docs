<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\CryptoEncoding\PEM;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;

/**
 * Base class for public keys.
 */
abstract class PublicKey
{
    /**
     * Get the public key algorithm identifier.
     */
    abstract public function algorithmIdentifier(): AlgorithmIdentifierType;

    /**
     * Get DER encoding of the public key.
     */
    abstract public function toDER(): string;

    /**
     * Get the public key data for subjectPublicKey in PublicKeyInfo.
     */
    public function subjectPublicKey(): BitString
    {
        return new BitString($this->toDER());
    }

    /**
     * Get the public key as a PublicKeyInfo type.
     */
    public function publicKeyInfo(): PublicKeyInfo
    {
        return PublicKeyInfo::fromPublicKey($this);
    }

    /**
     * Initialize public key from PEM.
     *
     * @throws \UnexpectedValueException
     *
     * @return PublicKey
     */
    public static function fromPEM(PEM $pem)
    {
        switch ($pem->type()) {
            case PEM::TYPE_RSA_PUBLIC_KEY:
                return RSA\RSAPublicKey::fromDER($pem->data());
            case PEM::TYPE_PUBLIC_KEY:
                return PublicKeyInfo::fromPEM($pem)->publicKey();
        }
        throw new \UnexpectedValueException(
            'PEM type ' . $pem->type() . ' is not a valid public key.');
    }
}
