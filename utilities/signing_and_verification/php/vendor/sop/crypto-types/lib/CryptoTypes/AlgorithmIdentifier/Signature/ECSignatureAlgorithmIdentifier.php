<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Signature;

use Sop\ASN1\Element;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\SignatureAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 5758 - 3.2.  ECDSA Signature Algorithm

   When the ecdsa-with-SHA224, ecdsa-with-SHA256, ecdsa-with-SHA384, or
   ecdsa-with-SHA512 algorithm identifier appears in the algorithm field
   as an AlgorithmIdentifier, the encoding MUST omit the parameters
   field.
*/

/**
 * Base class for ECDSA signature algorithm identifiers.
 *
 * @see https://tools.ietf.org/html/rfc5758#section-3.2
 * @see https://tools.ietf.org/html/rfc5480#appendix-A
 */
abstract class ECSignatureAlgorithmIdentifier extends SpecificAlgorithmIdentifier implements SignatureAlgorithmIdentifier
{
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
        return new static();
    }

    /**
     * {@inheritdoc}
     */
    public function supportsKeyAlgorithm(AlgorithmIdentifier $algo): bool
    {
        return self::OID_EC_PUBLIC_KEY === $algo->oid();
    }

    /**
     * {@inheritdoc}
     */
    protected function _paramsASN1(): ?Element
    {
        return null;
    }
}
