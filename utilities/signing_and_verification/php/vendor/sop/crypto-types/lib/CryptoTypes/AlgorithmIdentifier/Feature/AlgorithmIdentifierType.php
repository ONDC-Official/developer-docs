<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Feature;

use Sop\ASN1\Type\Constructed\Sequence;

/**
 * Base interface for algorithm identifiers.
 */
interface AlgorithmIdentifierType
{
    /**
     * Get the object identifier of the algorithm.
     *
     * @return string Object identifier in dotted format
     */
    public function oid(): string;

    /**
     * Get a human readable name of the algorithm.
     */
    public function name(): string;

    /**
     * Generate ASN.1 structure.
     */
    public function toASN1(): Sequence;
}
