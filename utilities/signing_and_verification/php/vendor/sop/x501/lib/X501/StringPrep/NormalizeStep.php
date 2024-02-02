<?php

declare(strict_types = 1);

namespace Sop\X501\StringPrep;

/**
 * Implements 'Normalize' step of the Internationalized String Preparation
 * as specified by RFC 4518.
 *
 * @see https://tools.ietf.org/html/rfc4518#section-2.3
 */
class NormalizeStep implements PrepareStep
{
    /**
     * @param string $string UTF-8 encoded string
     *
     * @return string
     */
    public function apply(string $string): string
    {
        return normalizer_normalize($string, \Normalizer::NFKC);
    }
}
