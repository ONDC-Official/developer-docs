<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve25519;

use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\X25519AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\Asymmetric\PublicKey;

/**
 * Implements an intermediary object to store X25519 private key.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
class X25519PrivateKey extends Curve25519PrivateKey
{
    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new X25519AlgorithmIdentifier();
    }

    /**
     * {@inheritdoc}
     */
    public function publicKey(): PublicKey
    {
        if (!$this->hasPublicKey()) {
            throw new \LogicException('Public key not set.');
        }
        return new X25519PublicKey($this->_publicKeyData);
    }
}
