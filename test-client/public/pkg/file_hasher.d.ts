/* tslint:disable */
/* eslint-disable */
/**
* @returns {string}
*/
export function wasm_test(): string;
/**
* @param {any} row_title_js
* @param {any} row_content_js
* @returns {string}
*/
export function generate_row_hash(row_title_js: any, row_content_js: any): string;
/**
* @param {any} row_title_js
* @param {any} row_content_js
* @param {any} row_selector_js
* @returns {any}
*/
export function get_file_commitment_and_selected_row(row_title_js: any, row_content_js: any, row_selector_js: any): any;
/**
* @param {any} row_title_js
* @param {any} row_content_js
* @param {any} row_selector_js
* @returns {any}
*/
export function generate_proof(row_title_js: any, row_content_js: any, row_selector_js: any): any;
/**
* @param {any} accumulator_hash_js
* @param {any} row_accumulator_js
* @param {any} proof_js
* @returns {boolean}
*/
export function verify_correct_selector(accumulator_hash_js: any, row_accumulator_js: any, proof_js: any): boolean;
/**
* @param {number} num_threads
* @returns {Promise<any>}
*/
export function initThreadPool(num_threads: number): Promise<any>;
/**
* @param {number} receiver
*/
export function wbg_rayon_start_worker(receiver: number): void;
/**
*/
export class wbg_rayon_PoolBuilder {
  free(): void;
/**
* @returns {number}
*/
  numThreads(): number;
/**
* @returns {number}
*/
  receiver(): number;
/**
*/
  build(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly wasm_test: (a: number) => void;
  readonly generate_row_hash: (a: number, b: number, c: number) => void;
  readonly get_file_commitment_and_selected_row: (a: number, b: number, c: number) => number;
  readonly generate_proof: (a: number, b: number, c: number) => number;
  readonly verify_correct_selector: (a: number, b: number, c: number) => number;
  readonly __wbg_wbg_rayon_poolbuilder_free: (a: number) => void;
  readonly wbg_rayon_poolbuilder_numThreads: (a: number) => number;
  readonly wbg_rayon_poolbuilder_receiver: (a: number) => number;
  readonly wbg_rayon_poolbuilder_build: (a: number) => void;
  readonly wbg_rayon_start_worker: (a: number) => void;
  readonly initThreadPool: (a: number) => number;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_thread_destroy: () => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
