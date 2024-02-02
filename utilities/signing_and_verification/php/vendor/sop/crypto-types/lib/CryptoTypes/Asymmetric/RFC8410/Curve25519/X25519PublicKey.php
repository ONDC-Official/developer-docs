<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve25519;

use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\X25519AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;

/**
 * Implements an intermediary object to store X25519 public key.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
class X25519PublicKey extends Curve25519PublicKey
{
    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new X25519AlgorithmIdentifier();
    }
}
