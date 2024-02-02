<?php

declare(strict_types = 1);

namespace Sop\X501\StringPrep;

/**
 * Implement Internationalized String Preparation as specified by RFC 4518.
 *
 * @see https://tools.ietf.org/html/rfc4518
 */
class StringPreparer
{
    const STEP_TRANSCODE = 1;
    const STEP_MAP = 2;
    const STEP_NORMALIZE = 3;
    const STEP_PROHIBIT = 4;
    const STEP_CHECK_BIDI = 5;
    const STEP_INSIGNIFICANT_CHARS = 6;

    /**
     * Preparation steps.
     *
     * @var PrepareStep[]
     */
    protected $_steps;

    /**
     * Constructor.
     *
     * @param PrepareStep[] $steps Preparation steps to apply
     */
    protected function __construct(array $steps)
    {
        $this->_steps = $steps;
    }

    /**
     * Get default instance for given string type.
     *
     * @param int $string_type ASN.1 string type tag.
     *
     * @return self
     */
    public static function forStringType(int $string_type): self
    {
        $steps = [
            self::STEP_TRANSCODE => new TranscodeStep($string_type),
            self::STEP_MAP => new MapStep(),
            self::STEP_NORMALIZE => new NormalizeStep(),
            self::STEP_PROHIBIT => new ProhibitStep(),
            self::STEP_CHECK_BIDI => new CheckBidiStep(),
            // @todo Vary by string type
            self::STEP_INSIGNIFICANT_CHARS => new InsignificantNonSubstringSpaceStep(),
        ];
        return new self($steps);
    }

    /**
     * Get self with case folding set.
     *
     * @param bool $fold True to apply case folding
     *
     * @return self
     */
    public function withCaseFolding(bool $fold): self
    {
        $obj = clone $this;
        $obj->_steps[self::STEP_MAP] = new MapStep($fold);
        return $obj;
    }

    /**
     * Prepare string.
     *
     * @param string $string
     *
     * @return string
     */
    public function prepare(string $string): string
    {
        foreach ($this->_steps as $step) {
            $string = $step->apply($string);
        }
        return $string;
    }
}
