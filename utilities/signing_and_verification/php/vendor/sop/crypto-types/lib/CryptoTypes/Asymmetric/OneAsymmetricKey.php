<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Constructed\Sequence;
use Sop\ASN1\Type\Primitive\BitString;
use Sop\ASN1\Type\Primitive\Integer;
use Sop\ASN1\Type\Primitive\OctetString;
use Sop\ASN1\Type\Tagged\ImplicitlyTaggedType;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoEncoding\PEM;
use Sop\CryptoTypes\AlgorithmIdentifier\AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\ECPublicKeyAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\Asymmetric\Attribute\OneAsymmetricKeyAttributes;

/**
 * Implements PKCS #8 PrivateKeyInfo / OneAsymmetricKey ASN.1 type.
 *
 * @see https://tools.ietf.org/html/rfc5208#section-5
 * @see https://tools.ietf.org/html/rfc5958#section-2
 */
class OneAsymmetricKey
{
    /**
     * Version number for PrivateKeyInfo.
     *
     * @var int
     */
    public const VERSION_1 = 0;

    /**
     * Version number for OneAsymmetricKey.
     *
     * @var int
     */
    public const VERSION_2 = 1;

    /**
     * Version number.
     *
     * @var int
     */
    protected $_version;

    /**
     * Algorithm identifier.
     *
     * @var AlgorithmIdentifierType
     */
    protected $_algo;

    /**
     * Private key data.
     *
     * @var string
     */
    protected $_privateKeyData;

    /**
     * Optional attributes.
     *
     * @var null|OneAsymmetricKeyAttributes
     */
    protected $_attributes;

    /**
     * Optional public key data.
     *
     * @var null|BitString
     */
    protected $_publicKeyData;

    /**
     * Constructor.
     *
     * @param AlgorithmIdentifierType         $algo       Algorithm
     * @param string                          $key        Private key data
     * @param null|OneAsymmetricKeyAttributes $attributes Optional attributes
     * @param null|BitString                  $public_key Optional public key
     */
    public function __construct(AlgorithmIdentifierType $algo, string $key,
        ?OneAsymmetricKeyAttributes $attributes = null,
        ?BitString $public_key = null)
    {
        $this->_version = self::VERSION_2;
        $this->_algo = $algo;
        $this->_privateKeyData = $key;
        $this->_attributes = $attributes;
        $this->_publicKeyData = $public_key;
    }

    /**
     * Initialize from ASN.1.
     *
     * @throws \UnexpectedValueException
     */
    public static function fromASN1(Sequence $seq): self
    {
        $version = $seq->at(0)->asInteger()->intNumber();
        if (!in_array($version, [self::VERSION_1, self::VERSION_2])) {
            throw new \UnexpectedValueException(
                "Version {$version} not supported.");
        }
        $algo = AlgorithmIdentifier::fromASN1($seq->at(1)->asSequence());
        $key = $seq->at(2)->asOctetString()->string();
        $attribs = null;
        if ($seq->hasTagged(0)) {
            $attribs = OneAsymmetricKeyAttributes::fromASN1($seq->getTagged(0)
                ->asImplicit(Element::TYPE_SET)->asSet());
        }
        $pubkey = null;
        if ($seq->hasTagged(1)) {
            $pubkey = $seq->getTagged(1)
                ->asImplicit(Element::TYPE_BIT_STRING)->asBitString();
        }
        $obj = new static($algo, $key, $attribs, $pubkey);
        $obj->_version = $version;
        return $obj;
    }

    /**
     * Initialize from DER data.
     */
    public static function fromDER(string $data): self
    {
        return self::fromASN1(UnspecifiedType::fromDER($data)->asSequence());
    }

    /**
     * Initialize from a `PrivateKey`.
     *
     * Note that `OneAsymmetricKey` <-> `PrivateKey` conversions may not be
     * bidirectional with all key types, since `OneAsymmetricKey` may include
     * attributes as well the public key that are not conveyed in a specific
     * `PrivateKey` object.
     */
    public static function fromPrivateKey(PrivateKey $private_key): self
    {
        return new static(
            $private_key->algorithmIdentifier(),
            $private_key->privateKeyData()
        );
    }

    /**
     * Initialize from PEM.
     *
     * @throws \UnexpectedValueException If PEM type is not supported
     */
    public static function fromPEM(PEM $pem): self
    {
        switch ($pem->type()) {
            case PEM::TYPE_PRIVATE_KEY:
                return self::fromDER($pem->data());
            case PEM::TYPE_RSA_PRIVATE_KEY:
                return self::fromPrivateKey(
                    RSA\RSAPrivateKey::fromDER($pem->data()));
            case PEM::TYPE_EC_PRIVATE_KEY:
                return self::fromPrivateKey(
                    EC\ECPrivateKey::fromDER($pem->data()));
        }
        throw new \UnexpectedValueException('Invalid PEM type.');
    }

    /**
     * Get self with version set.
     */
    public function withVersion(int $version): self
    {
        $obj = clone $this;
        $obj->_version = $version;
        return $obj;
    }

    /**
     * Get version number.
     */
    public function version(): int
    {
        return $this->_version;
    }

    /**
     * Get algorithm identifier.
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return $this->_algo;
    }

    /**
     * Get private key data.
     */
    public function privateKeyData(): string
    {
        return $this->_privateKeyData;
    }

    /**
     * Get private key.
     *
     * @throws \RuntimeException
     */
    public function privateKey(): PrivateKey
    {
        $algo = $this->algorithmIdentifier();
        switch ($algo->oid()) {
            // RSA
            case AlgorithmIdentifier::OID_RSA_ENCRYPTION:
                return RSA\RSAPrivateKey::fromDER($this->_privateKeyData);
            // elliptic curve
            case AlgorithmIdentifier::OID_EC_PUBLIC_KEY:
                $pk = EC\ECPrivateKey::fromDER($this->_privateKeyData);
                // NOTE: OpenSSL strips named curve from ECPrivateKey structure
                // when serializing into PrivateKeyInfo. However RFC 5915 dictates
                // that parameters (NamedCurve) must always be included.
                // If private key doesn't encode named curve, assign from parameters.
                if (!$pk->hasNamedCurve()) {
                    if (!$algo instanceof ECPublicKeyAlgorithmIdentifier) {
                        throw new \UnexpectedValueException('Not an EC algorithm.');
                    }
                    $pk = $pk->withNamedCurve($algo->namedCurve());
                }
                return $pk;
            // Ed25519
            case AlgorithmIdentifier::OID_ED25519:
                $pubkey = $this->_publicKeyData ?
                    $this->_publicKeyData->string() : null;
                // RFC 8410 defines `CurvePrivateKey ::= OCTET STRING` that
                // is encoded into private key data. So Ed25519 private key
                // is doubly wrapped into octet string encodings.
                return RFC8410\Curve25519\Ed25519PrivateKey::fromOctetString(
                    OctetString::fromDER($this->_privateKeyData), $pubkey)
                    ->withVersion($this->_version)
                    ->withAttributes($this->_attributes);
            // X25519
            case AlgorithmIdentifier::OID_X25519:
                $pubkey = $this->_publicKeyData ?
                    $this->_publicKeyData->string() : null;
                return RFC8410\Curve25519\X25519PrivateKey::fromOctetString(
                    OctetString::fromDER($this->_privateKeyData), $pubkey)
                    ->withVersion($this->_version)
                    ->withAttributes($this->_attributes);
            // Ed448
            case AlgorithmIdentifier::OID_ED448:
                $pubkey = $this->_publicKeyData ?
                    $this->_publicKeyData->string() : null;
                return RFC8410\Curve448\Ed448PrivateKey::fromOctetString(
                    OctetString::fromDER($this->_privateKeyData), $pubkey)
                    ->withVersion($this->_version)
                    ->withAttributes($this->_attributes);
            // X448
            case AlgorithmIdentifier::OID_X448:
                $pubkey = $this->_publicKeyData ?
                    $this->_publicKeyData->string() : null;
                return RFC8410\Curve448\X448PrivateKey::fromOctetString(
                    OctetString::fromDER($this->_privateKeyData), $pubkey)
                    ->withVersion($this->_version)
                    ->withAttributes($this->_attributes);
        }
        throw new \RuntimeException(
            'Private key ' . $algo->name() . ' not supported.');
    }

    /**
     * Get public key info corresponding to the private key.
     */
    public function publicKeyInfo(): PublicKeyInfo
    {
        // if public key is explicitly defined
        if ($this->hasPublicKeyData()) {
            return new PublicKeyInfo($this->_algo, $this->_publicKeyData);
        }
        // else derive from private key
        return $this->privateKey()->publicKey()->publicKeyInfo();
    }

    /**
     * Whether attributes are present.
     */
    public function hasAttributes(): bool
    {
        return isset($this->_attributes);
    }

    /**
     * Get attributes.
     *
     * @throws \LogicException If attributes are not present
     */
    public function attributes(): OneAsymmetricKeyAttributes
    {
        if (!$this->hasAttributes()) {
            throw new \LogicException('Attributes not set.');
        }
        return $this->_attributes;
    }

    /**
     * Whether explicit public key data is present.
     */
    public function hasPublicKeyData(): bool
    {
        return isset($this->_publicKeyData);
    }

    /**
     * Get the explicit public key data.
     *
     * @return \LogicException If public key is not present
     */
    public function publicKeyData(): BitString
    {
        if (!$this->hasPublicKeyData()) {
            throw new \LogicException('No explicit public key.');
        }
        return $this->_publicKeyData;
    }

    /**
     * Generate ASN.1 structure.
     */
    public function toASN1(): Sequence
    {
        $elements = [
            new Integer($this->_version),
            $this->_algo->toASN1(),
            new OctetString($this->_privateKeyData)
        ];
        if ($this->_attributes) {
            $elements[] = new ImplicitlyTaggedType(0,
                $this->_attributes->toASN1());
        }
        if ($this->_publicKeyData) {
            $elements[] = new ImplicitlyTaggedType(1, $this->_publicKeyData);
        }
        return new Sequence(...$elements);
    }

    /**
     * Generate DER encoding.
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
        return new PEM(PEM::TYPE_PRIVATE_KEY, $this->toDER());
    }
}
