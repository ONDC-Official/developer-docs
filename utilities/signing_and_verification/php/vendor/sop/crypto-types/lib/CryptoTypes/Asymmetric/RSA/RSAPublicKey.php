<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RSA;

use Sop\ASN1\Type\Constructed\Sequence;
use Sop\ASN1\Type\Primitive\Integer;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoEncoding\PEM;
use Sop\CryptoTypes\AlgorithmIdentifier\AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\RSAEncryptionAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\Asymmetric\PublicKey;
use Sop\CryptoTypes\Asymmetric\PublicKeyInfo;

/**
 * Implements PKCS #1 RSAPublicKey ASN.1 type.
 *
 * @see https://tools.ietf.org/html/rfc2437#section-11.1.1
 */
class RSAPublicKey extends PublicKey
{
    /**
     * Modulus as a base 10 integer.
     *
     * @var string
     */
    protected $_modulus;

    /**
     * Public exponent as a base 10 integer.
     *
     * @var string
     */
    protected $_publicExponent;

    /**
     * Constructor.
     *
     * @param int|string $n Modulus
     * @param int|string $e Public exponent
     */
    public function __construct($n, $e)
    {
        $this->_modulus = strval($n);
        $this->_publicExponent = strval($e);
    }

    /**
     * Initialize from ASN.1.
     *
     * @return self
     */
    public static function fromASN1(Sequence $seq): RSAPublicKey
    {
        $n = $seq->at(0)->asInteger()->number();
        $e = $seq->at(1)->asInteger()->number();
        return new self($n, $e);
    }

    /**
     * Initialize from DER data.
     *
     * @return self
     */
    public static function fromDER(string $data): RSAPublicKey
    {
        return self::fromASN1(UnspecifiedType::fromDER($data)->asSequence());
    }

    /**
     * @see PublicKey::fromPEM()
     *
     * @throws \UnexpectedValueException
     *
     * @return self
     */
    public static function fromPEM(PEM $pem): RSAPublicKey
    {
        switch ($pem->type()) {
            case PEM::TYPE_RSA_PUBLIC_KEY:
                return self::fromDER($pem->data());
            case PEM::TYPE_PUBLIC_KEY:
                $pki = PublicKeyInfo::fromDER($pem->data());
                if (AlgorithmIdentifier::OID_RSA_ENCRYPTION !==
                    $pki->algorithmIdentifier()->oid()) {
                    throw new \UnexpectedValueException('Not an RSA public key.');
                }
                return self::fromDER($pki->publicKeyData()->string());
        }
        throw new \UnexpectedValueException('Invalid PEM type ' . $pem->type());
    }

    /**
     * Get modulus.
     *
     * @return string Base 10 integer
     */
    public function modulus(): string
    {
        return $this->_modulus;
    }

    /**
     * Get public exponent.
     *
     * @return string Base 10 integer
     */
    public function publicExponent(): string
    {
        return $this->_publicExponent;
    }

    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new RSAEncryptionAlgorithmIdentifier();
    }

    /**
     * Generate ASN.1 structure.
     */
    public function toASN1(): Sequence
    {
        return new Sequence(new Integer($this->_modulus),
            new Integer($this->_publicExponent));
    }

    /**
     * {@inheritdoc}
     */
    public function toDER(): string
    {
        return $this->toASN1()->toDER();
    }

    /**
     * Generate PEM.
     */
    public function toPEM(): PEM
    {
        return new PEM(PEM::TYPE_RSA_PUBLIC_KEY, $this->toDER());
    }
}
