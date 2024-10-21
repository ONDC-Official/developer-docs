<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\NullType;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AsymmetricCryptoAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 3447:

    When rsaEncryption is used in an AlgorithmIdentifier the
    parameters MUST be present and MUST be NULL.
*/

/**
 * Algorithm identifier for RSA encryption.
 *
 * @see http://www.oid-info.com/get/1.2.840.113549.1.1.1
 * @see https://tools.ietf.org/html/rfc3447#appendix-C
 */
class RSAEncryptionAlgorithmIdentifier extends SpecificAlgorithmIdentifier implements AsymmetricCryptoAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_RSA_ENCRYPTION;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'rsaEncryption';
    }

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1Params(
        ?UnspecifiedType $params = null): SpecificAlgorithmIdentifier
    {
        if (!isset($params)) {
            throw new \UnexpectedValueException('No parameters.');
        }
        $params->asNull();
        return new self();
    }

    /**
     * {@inheritdoc}
     *
     * @return NullType
     */
    protected function _paramsASN1(): ?Element
    {
        return new NullType();
    }
}
