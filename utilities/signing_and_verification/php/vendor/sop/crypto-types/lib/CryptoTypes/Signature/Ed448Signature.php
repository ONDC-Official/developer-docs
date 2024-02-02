<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Signature;

use Sop\ASN1\Type\Primitive\BitString;

/**
 * Implements Ed448 signature value.
 *
 * @todo Implement signature parsing
 *
 * @see https://tools.ietf.org/html/rfc8032#section-5.2.6
 */
class Ed448Signature extends Signature
{
    /**
     * Signature value.
     *
     * @var string
     */
    private $_signature;

    /**
     * Constructor.
     */
    public function __construct(string $signature)
    {
        if (114 !== strlen($signature)) {
            throw new \InvalidArgumentException(
                'Ed448 signature must be 114 octets.');
        }
        $this->_signature = $signature;
    }

    /**
     * {@inheritdoc}
     */
    public function bitString(): BitString
    {
        return new BitString($this->_signature);
    }
}
