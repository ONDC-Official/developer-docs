<?php

declare(strict_types = 1);

namespace Sop\CryptoEncoding;

/**
 * Container for multiple PEM objects.
 *
 * The order of PEMs shall be retained, eg. when read from a file.
 */
class PEMBundle implements \Countable, \IteratorAggregate
{
    /**
     * Array of PEM objects.
     *
     * @var PEM[]
     */
    protected $_pems;

    /**
     * Constructor.
     *
     * @param PEM ...$pems
     */
    public function __construct(PEM ...$pems)
    {
        $this->_pems = $pems;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->string();
    }

    /**
     * Initialize from a string.
     *
     * @param string $str
     *
     * @throws \UnexpectedValueException
     *
     * @return self
     */
    public static function fromString(string $str): self
    {
        if (!preg_match_all(PEM::PEM_REGEX, $str, $matches, PREG_SET_ORDER)) {
            throw new \UnexpectedValueException('No PEM blocks.');
        }
        $pems = array_map(
            function ($match) {
                $payload = preg_replace('/\s+/', '', $match[2]);
                $data = base64_decode($payload, true);
                if (false === $data) {
                    throw new \UnexpectedValueException(
                        'Failed to decode PEM data.');
                }
                return new PEM($match[1], $data);
            }, $matches);
        return new self(...$pems);
    }

    /**
     * Initialize from a file.
     *
     * @param string $filename
     *
     * @throws \RuntimeException If file reading fails
     *
     * @return self
     */
    public static function fromFile(string $filename): self
    {
        if (!is_readable($filename) ||
            false === ($str = file_get_contents($filename))) {
            throw new \RuntimeException("Failed to read {$filename}.");
        }
        return self::fromString($str);
    }

    /**
     * Get self with PEM objects appended.
     *
     * @param PEM ...$pems
     *
     * @return self
     */
    public function withPEMs(PEM ...$pems): self
    {
        $obj = clone $this;
        $obj->_pems = array_merge($obj->_pems, $pems);
        return $obj;
    }

    /**
     * Get all PEMs in a bundle.
     *
     * @return PEM[]
     */
    public function all(): array
    {
        return $this->_pems;
    }

    /**
     * Get the first PEM in a bundle.
     *
     * @throws \LogicException If bundle contains no PEM objects
     *
     * @return PEM
     */
    public function first(): PEM
    {
        if (!count($this->_pems)) {
            throw new \LogicException('No PEMs.');
        }
        return $this->_pems[0];
    }

    /**
     * Get the last PEM in a bundle.
     *
     * @throws \LogicException If bundle contains no PEM objects
     *
     * @return PEM
     */
    public function last(): PEM
    {
        if (!count($this->_pems)) {
            throw new \LogicException('No PEMs.');
        }
        return $this->_pems[count($this->_pems) - 1];
    }

    /**
     * @see \Countable::count()
     *
     * @return int
     */
    public function count(): int
    {
        return count($this->_pems);
    }

    /**
     * Get iterator for PEMs.
     *
     * @see \IteratorAggregate::getIterator()
     *
     * @return \ArrayIterator
     */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->_pems);
    }

    /**
     * Encode bundle to a string of contiguous PEM blocks.
     *
     * @return string
     */
    public function string(): string
    {
        return implode("\n",
            array_map(
                function (PEM $pem) {
                    return $pem->string();
                }, $this->_pems));
    }
}
