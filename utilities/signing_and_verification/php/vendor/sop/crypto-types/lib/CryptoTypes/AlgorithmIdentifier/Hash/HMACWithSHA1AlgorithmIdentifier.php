<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

use Sop\ASN1\Element;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\HashAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\PRFAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
Per RFC 2898 this algorithm identifier has no parameters:

algid-hmacWithSHA1 AlgorithmIdentifier {{PBKDF2-PRFs}} ::=
    {algorithm id-hmacWithSHA1, parameters NULL : NULL}
*/

/**
 * HMAC-SHA-1 algorithm identifier.
 *
 * @see http://www.alvestrand.no/objectid/1.2.840.113549.2.7.html
 * @see http://www.oid-info.com/get/1.2.840.113549.2.7
 * @see https://tools.ietf.org/html/rfc2898#appendix-C
 */
class HMACWithSHA1AlgorithmIdentifier extends SpecificAlgorithmIdentifier implements HashAlgorithmIdentifier, PRFAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_HMAC_WITH_SHA1;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'hmacWithSHA1';
    }

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1Params(
        ?UnspecifiedType $params = null): SpecificAlgorithmIdentifier
    {
        if (isset($params)) {
            throw new \UnexpectedValueException('Parameters must be omitted.');
        }
        return new self();
    }

    /**
     * {@inheritdoc}
     */
    protected function _paramsASN1(): ?Element
    {
        return null;
    }
}
