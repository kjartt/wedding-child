import test from 'node:test'
import assert from 'node:assert/strict'
import { parseValues, restoreValues, saveValues } from '../src/api.ts'

const data = { a: 100, b: 0, hash: '100|0', fetchedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), stale: false }

test('runtime contract rejects invalid amounts, absent freshness and malformed dates', () => {
  assert.deepEqual(parseValues(data), data)
  for (const change of [{ a: null }, { a: -1 }, { a: '100' }, { a: Infinity }, { stale: undefined },
    { fetchedAt: 'yesterday' }, { hash: 'bad' }, { updatedAt: null }]) {
    assert.throws(() => parseValues({ ...data, ...change }))
  }
  assert.throws(() => parseValues(null))
})

test('restored snapshot is always stale; corrupt or old browser data is ignored', () => {
  let stored = null
  globalThis.localStorage = { getItem: () => stored, setItem: (_key, value) => { stored = value } }
  saveValues(data)
  assert.equal(restoreValues().stale, true)
  assert.equal(restoreValues().a, 100)
  stored = '{bad'
  assert.equal(restoreValues(), null)
  stored = JSON.stringify({ ...data, fetchedAt: '2020-01-01T00:00:00Z' })
  assert.equal(restoreValues(), null)
  globalThis.localStorage = { getItem() { throw Error('denied') }, setItem() { throw Error('denied') } }
  assert.equal(restoreValues(), null)
  assert.doesNotThrow(() => saveValues(data))
  delete globalThis.localStorage
})
