<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier;

use Sop\ASN1\Type\Constructed\Sequence;

/**
 * Factory class to parse AlgorithmIdentifier ASN.1 types to specific
 * algorithm identifier objects.
 *
 * Additional providers may be added to the process to support algorithm
 * identifiers that are implemented in external libraries.
 */
class AlgorithmIdentifierFactory
{
    /**
     * Mapping for algorithm identifiers provided by this library.
     *
     * @internal
     *
     * @var array
     */
    public const MAP_OID_TO_CLASS = [
        AlgorithmIdentifier::OID_RSA_ENCRYPTION => Asymmetric\RSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_EC_PUBLIC_KEY => Asymmetric\ECPublicKeyAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_X25519 => Asymmetric\X25519AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_X448 => Asymmetric\X448AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ED25519 => Asymmetric\Ed25519AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ED448 => Asymmetric\Ed448AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_DES_CBC => Cipher\DESCBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_DES_EDE3_CBC => Cipher\DESEDE3CBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_RC2_CBC => Cipher\RC2CBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_AES_128_CBC => Cipher\AES128CBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_AES_192_CBC => Cipher\AES192CBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_AES_256_CBC => Cipher\AES256CBCAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_HMAC_WITH_SHA1 => Hash\HMACWithSHA1AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_HMAC_WITH_SHA224 => Hash\HMACWithSHA224AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_HMAC_WITH_SHA256 => Hash\HMACWithSHA256AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_HMAC_WITH_SHA384 => Hash\HMACWithSHA384AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_HMAC_WITH_SHA512 => Hash\HMACWithSHA512AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_MD5 => Hash\MD5AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA1 => Hash\SHA1AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA224 => Hash\SHA224AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA256 => Hash\SHA256AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA384 => Hash\SHA384AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA512 => Hash\SHA512AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_MD2_WITH_RSA_ENCRYPTION => Signature\MD2WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_MD4_WITH_RSA_ENCRYPTION => Signature\MD4WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_MD5_WITH_RSA_ENCRYPTION => Signature\MD5WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA1_WITH_RSA_ENCRYPTION => Signature\SHA1WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA224_WITH_RSA_ENCRYPTION => Signature\SHA224WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA256_WITH_RSA_ENCRYPTION => Signature\SHA256WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA384_WITH_RSA_ENCRYPTION => Signature\SHA384WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_SHA512_WITH_RSA_ENCRYPTION => Signature\SHA512WithRSAEncryptionAlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ECDSA_WITH_SHA1 => Signature\ECDSAWithSHA1AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ECDSA_WITH_SHA224 => Signature\ECDSAWithSHA224AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ECDSA_WITH_SHA256 => Signature\ECDSAWithSHA256AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ECDSA_WITH_SHA384 => Signature\ECDSAWithSHA384AlgorithmIdentifier::class,
        AlgorithmIdentifier::OID_ECDSA_WITH_SHA512 => Signature\ECDSAWithSHA512AlgorithmIdentifier::class,
    ];

    /**
     * Additional algorithm identifier providers.
     *
     * @var AlgorithmIdentifierProvider[]
     */
    private $_additionalProviders;

    /**
     * Constructor.
     *
     * @param AlgorithmIdentifierProvider ...$providers Additional providers
     */
    public function __construct(AlgorithmIdentifierProvider ...$providers)
    {
        $this->_additionalProviders = $providers;
    }

    /**
     * Get the name of a class that implements algorithm identifier for given
     * OID.
     *
     * @param string $oid Object identifier in dotted format
     *
     * @return null|string Fully qualified class name or null if not supported
     */
    public function getClass(string $oid): ?string
    {
        // if OID is provided by this factory
        if (array_key_exists($oid, self::MAP_OID_TO_CLASS)) {
            return self::MAP_OID_TO_CLASS[$oid];
        }
        // try additional providers
        foreach ($this->_additionalProviders as $provider) {
            if ($provider->supportsOID($oid)) {
                return $provider->getClassByOID($oid);
            }
        }
        return null;
    }

    /**
     * Parse AlgorithmIdentifier from an ASN.1 sequence.
     */
    public function parse(Sequence $seq): AlgorithmIdentifier
    {
        $oid = $seq->at(0)->asObjectIdentifier()->oid();
        $params = $seq->has(1) ? $seq->at(1) : null;
        /** @var SpecificAlgorithmIdentifier $cls */
        $cls = $this->getClass($oid);
        if ($cls) {
            return $cls::fromASN1Params($params);
        }
        // fallback to generic algorithm identifier
        return new GenericAlgorithmIdentifier($oid, $params);
    }
}
