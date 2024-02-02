<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve448;

use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\Ed448AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\Asymmetric\PublicKey;
use Sop\CryptoTypes\Asymmetric\RFC8410\RFC8410PrivateKey;

/**
 * Implements an intermediary class to store Ed448 private key.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
class Ed448PrivateKey extends RFC8410PrivateKey
{
    /**
     * Constructor.
     *
     * @param string      $private_key Private key data
     * @param null|string $public_key  Public key data
     */
    public function __construct(string $private_key, ?string $public_key = null)
    {
        if (57 !== strlen($private_key)) {
            throw new \UnexpectedValueException(
                'Ed448 private key must be exactly 57 bytes.');
        }
        if (isset($public_key) && 57 !== strlen($public_key)) {
            throw new \UnexpectedValueException(
                'Ed448 public key must be exactly 57 bytes.');
        }
        parent::__construct($private_key, $public_key);
    }

    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new Ed448AlgorithmIdentifier();
    }

    /**
     * {@inheritdoc}
     */
    public function publicKey(): PublicKey
    {
        if (!$this->hasPublicKey()) {
            throw new \LogicException('Public key not set.');
        }
        return new Ed448PublicKey($this->_publicKeyData);
    }
}
