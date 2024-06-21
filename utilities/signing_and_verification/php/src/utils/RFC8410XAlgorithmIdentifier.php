<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

use Sop\ASN1\Element;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AsymmetricCryptoAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 8410:

    For all of the OIDs, the parameters MUST be absent.

    It is possible to find systems that require the parameters to be
    present.  This can be due to either a defect in the original 1997
    syntax or a programming error where developers never got input where
    this was not true.  The optimal solution is to fix these systems;
    where this is not possible, the problem needs to be restricted to
    that subsystem and not propagated to the Internet.
*/

/**
 * Algorithm identifier for the Diffie-Hellman operations specified by RFC 8410.
 *
 * @see https://tools.ietf.org/html/rfc8410#section-3
 */
abstract class RFC8410XAlgorithmIdentifier extends SpecificAlgorithmIdentifier implements AsymmetricCryptoAlgorithmIdentifier
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
            throw new \UnexpectedValueException('Parameters must be absent.');
        }
        return new static();
    }

    /**
     * {@inheritdoc}
     */
    protected function _paramsASN1(): ?Element
    {
        return null;
    }
}
