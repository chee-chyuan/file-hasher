use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

pub use wasm_bindgen_rayon::init_thread_pool;

use crate::circuits::file_hasher::FileHashPartialCircuit;
use halo2_gadgets::poseidon::primitives::{self as poseidon, ConstantLength, P128Pow5T3};
use halo2_proofs::arithmetic::FieldExt;
use halo2_proofs::circuit::Value;
use halo2_proofs::pasta::{EqAffine, Fp};
use halo2_proofs::plonk::{create_proof, keygen_pk, keygen_vk, verify_proof, SingleVerifier};
use halo2_proofs::poly::commitment::Params;
use halo2_proofs::transcript::{Blake2bRead, Blake2bWrite, Challenge255};
use rand_core::OsRng;

use ff::PrimeFieldBits;

#[wasm_bindgen]
pub fn wasm_test() -> String {
    // let xx_u32 = xx.into_serde::<[u32; 8]>().unwrap();
    // let xx_u64 = convert_hash_u32_to_u64(xx_u32);

    // let yy_u32 = convert_hash_u64_to_u32(xx_u64);
    // JsValue::from_serde(&yy_u32).unwrap()

    let a = Fp::from(5);
    let b = Fp::from(7);

    let message = [a, b];

    let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

    // let output_le_bits = output.to_le_bits();
    // let output_raw_slice = output_le_bits.as_raw_slice();
    // JsValue::from_serde(&output_raw_slice).unwrap()
    format!("{:?}", output)
}

fn convert_hash_u32_to_u64(hash_u32: [u32; 8]) -> [u64; 4] {
    let mut res = Vec::new();
    for i in 0..4 {
        let starting_index = i * 2;
        let arr = [hash_u32[starting_index], hash_u32[starting_index + 1]];
        let res_u64 = convert_u32_to_u64_BE(arr);
        res.push(res_u64);
    }

    res.try_into().unwrap()
}

fn convert_hash_u32_to_u64_LE(hash_u32: [u32; 8]) -> [u64; 4] {
    let mut res = Vec::new();
    for i in 0..4 {
        let starting_index = i * 2;
        let arr = [hash_u32[starting_index], hash_u32[starting_index + 1]];
        let res_u64 = convert_u32_to_u64_BE(arr);
        res.push(res_u64);
    }

    res.reverse();
    res.try_into().unwrap()
}

fn convert_u32_to_u64_BE(u32_array: [u32; 2]) -> u64 {
    u32_array[0] as u64 * u64::pow(2, 32) + u32_array[1] as u64
}

fn convert_hash_u64_to_u32(hash_u64: [u64; 4]) -> [u32; 8] {
    let mut res = Vec::new();
    for num in hash_u64 {
        let res_u32 = convert_u64_to_u32_BE(num);
        res.push(res_u32[0]);
        res.push(res_u32[1]);
    }

    res.try_into().unwrap()
}

fn convert_u64_to_u32_BE(input: u64) -> [u32; 2] {
    let lower = input as u32;
    let upper = (input >> 32) as u32;

    [upper, lower]
}

fn convert_to_u64_array(input: &[u64]) -> [u64; 4] {
    let mut res = Vec::new();
    for i in 0..4 {
        res.push(input[i]);
    }

    res.try_into().unwrap()
}

#[wasm_bindgen]
pub fn generate_row_hash(row_title_js: JsValue, row_content_js: JsValue) -> String {
    let row_title_u32 = row_title_js.into_serde::<[u32; 8]>().unwrap();
    let row_content_u32 = row_content_js.into_serde::<[u32; 8]>().unwrap();

    let row_title_u64 = convert_hash_u32_to_u64(row_title_u32);
    let row_content_u64 = convert_hash_u32_to_u64(row_content_u32);

    let row_title = row_title_u64.map(|x| return Fp::from(x));
    let row_content = row_content_u64.map(|x| return Fp::from(x));

    let title_message_1 = [row_title[0], row_title[1]];
    let title_message_2 = [row_title[2], row_title[3]];

    let title_message_1_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_1);
    let title_message_2_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_2);
    let title_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([title_message_1_output, title_message_2_output]);

    let content_message_1 = [row_content[0], row_content[1]];
    let content_message_2 = [row_content[2], row_content[3]];

    let content_message_1_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(content_message_1);
    let content_message_2_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(content_message_2);
    let content_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([content_message_1_output, content_message_2_output]);
    let message = [title_hash, content_hash];
    let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

    format!("{:?}", output)
}

#[wasm_bindgen]
pub fn get_file_commitment_and_selected_row(
    row_title_js: JsValue,
    row_content_js: JsValue,
    row_selector_js: JsValue,
) -> JsValue {
    const ROW: usize = 2;
    let row_title_u32 = row_title_js.into_serde::<[[u32; 8]; ROW]>().unwrap();
    let row_content_u32 = row_content_js.into_serde::<[[u32; 8]; ROW]>().unwrap();

    let row_title_u64 = row_title_u32.map(|x| return convert_hash_u32_to_u64(x));
    let row_content_u64 = row_content_u32.map(|x| return convert_hash_u32_to_u64(x));
    let row_selector_u64 = row_selector_js.into_serde::<[u64; ROW]>().unwrap();

    let row_title = row_title_u64.map(|x| x.map(|y| return Fp::from(y)));
    let row_content = row_content_u64.map(|x| x.map(|y| return Fp::from(y)));
    let row_selector = row_selector_u64.map(|x| return Fp::from(x));

    let mut row_hash = Vec::new();
    let mut row_accumulator = Fp::zero();
    for ((&title, &content), &row_selector) in row_title
        .iter()
        .zip(row_content.iter())
        .zip(row_selector.iter())
    {
        let title_message_1 = [title[0], title[1]];
        let title_message_2 = [title[2], title[3]];

        let title_message_1_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_1);
        let title_message_2_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_2);
        let title_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
            .hash([title_message_1_output, title_message_2_output]);

        let content_message_1 = [content[0], content[1]];
        let content_message_2 = [content[2], content[3]];

        let content_message_1_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
                .hash(content_message_1);
        let content_message_2_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
                .hash(content_message_2);
        let content_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
            .hash([content_message_1_output, content_message_2_output]);
        let message = [title_hash, content_hash];
        let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

        row_hash.push(output);

        if row_selector == Fp::one() {
            row_accumulator += output;
        }
    }

    let mut file_commitment = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([row_hash[0], row_hash[1]]);

    for i in 2..row_content.len() {
        let message = [file_commitment, row_hash[i]];
        let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);
        file_commitment = output;
    }

    let res_array = [
        format!("{:?}", file_commitment),
        format!("{:?}", row_accumulator),
    ];
    JsValue::from_serde(&res_array).unwrap()
}

#[wasm_bindgen]
pub fn get_selected_row(row_title_js: JsValue, row_content_js: JsValue) -> JsValue {
    let row_title_u32 = row_title_js.into_serde::<[u32; 8]>().unwrap();
    let row_content_u32 = row_content_js.into_serde::<[u32; 8]>().unwrap();

    let row_title_u64 = convert_hash_u32_to_u64(row_title_u32);
    let row_content_u64 = convert_hash_u32_to_u64(row_content_u32);

    let row_title = row_title_u64.map(|y| return Fp::from(y));
    let row_content = row_content_u64.map(|y| return Fp::from(y));

    let title_message_1 = [row_title[0], row_title[1]];
    let title_message_2 = [row_title[2], row_title[3]];

    let title_message_1_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_1);
    let title_message_2_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_2);
    let title_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([title_message_1_output, title_message_2_output]);

    let content_message_1 = [row_content[0], row_content[1]];
    let content_message_2 = [row_content[2], row_content[3]];

    let content_message_1_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(content_message_1);
    let content_message_2_output =
        poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(content_message_2);
    let content_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([content_message_1_output, content_message_2_output]);
    let message = [title_hash, content_hash];
    let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

    JsValue::from_serde(&format!("{:?}", output)).unwrap()
}

// row_title_js, row_content_js, row_selector_js consist of 4 Fp from sha256 result of string
// this needs to be done in the js side
#[wasm_bindgen]
pub fn generate_proof(
    row_title_js: JsValue,
    row_content_js: JsValue,
    row_selector_js: JsValue,
) -> JsValue {
    let k = 10;
    let params: Params<EqAffine> = Params::new(k);

    const ROW: usize = 2;
    let row_title_u32 = row_title_js.into_serde::<[[u32; 8]; ROW]>().unwrap();
    let row_content_u32 = row_content_js.into_serde::<[[u32; 8]; ROW]>().unwrap();

    let row_title_u64 = row_title_u32.map(|x| return convert_hash_u32_to_u64(x));
    let row_content_u64 = row_content_u32.map(|x| return convert_hash_u32_to_u64(x));
    let row_selector_u64 = row_selector_js.into_serde::<[u64; ROW]>().unwrap();

    let row_title = row_title_u64.map(|x| x.map(|y| return Fp::from(y)));
    let row_content = row_content_u64.map(|x| x.map(|y| return Fp::from(y)));
    let row_selector = row_selector_u64.map(|x| return Fp::from(x));

    let circuit = FileHashPartialCircuit::<ROW> {
        row_title: row_title.map(|x| x.map(|y| Value::known(y))),
        row_content: row_content.map(|x| x.map(|y| Value::known(y))),
        row_selectors: row_selector.map(|x| Value::known(x)),
    };

    let empty_circuit = FileHashPartialCircuit::<ROW> {
        row_title: [[Value::unknown(); 4]; ROW],
        row_content: [[Value::unknown(); 4]; ROW],
        row_selectors: [Value::unknown(); ROW],
    };

    let mut row_hash = Vec::new();
    let mut row_accumulator = Fp::zero();
    for ((&title, &content), &row_selector) in row_title
        .iter()
        .zip(row_content.iter())
        .zip(row_selector.iter())
    {
        let title_message_1 = [title[0], title[1]];
        let title_message_2 = [title[2], title[3]];

        let title_message_1_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_1);
        let title_message_2_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(title_message_2);
        let title_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
            .hash([title_message_1_output, title_message_2_output]);

        let content_message_1 = [content[0], content[1]];
        let content_message_2 = [content[2], content[3]];

        let content_message_1_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
                .hash(content_message_1);
        let content_message_2_output =
            poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
                .hash(content_message_2);
        let content_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
            .hash([content_message_1_output, content_message_2_output]);
        let message = [title_hash, content_hash];
        let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

        row_hash.push(output);

        if row_selector == Fp::one() {
            row_accumulator += output;
        }
    }
    let mut accumulator_hash = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init()
        .hash([row_hash[0], row_hash[1]]);

    for i in 2..row_content.len() {
        let message = [accumulator_hash, row_hash[i]];
        let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);
        accumulator_hash = output;
    }

    let vk = keygen_vk(&params, &empty_circuit).expect("keygen_vk should not fail");
    let pk = keygen_pk(&params, vk, &empty_circuit).expect("keygen_pk should not fail");

    // JsValue::from_serde(&[format!("{:?}", accumulator_hash), format!("{:?}", row_accumulator)]).unwrap()

    let mut transcript = Blake2bWrite::<_, _, Challenge255<_>>::init(vec![]);
    let public_input = vec![accumulator_hash, row_accumulator];

    // Create a proof
    create_proof(
        &params,
        &pk,
        &[circuit.clone(), circuit.clone()],
        &[&[&public_input[..]], &[&public_input[..]]],
        OsRng,
        &mut transcript,
    )
    .expect("proof generation should not fail");
    let proof: Vec<u8> = transcript.finalize();

    // verify part
    // let strategy = SingleVerifier::new(&params);
    // let mut transcript = Blake2bRead::<_, _, Challenge255<_>>::init(&proof[..]);
    // verify_proof(
    //     &params,
    //     pk.get_vk(),
    //     strategy,
    //     &[&[&public_input[..]], &[&public_input[..]]],
    //     &mut transcript,
    // )
    // .is_ok()
    JsValue::from_serde(&proof).unwrap()
}

// pass in accumulator_hash and row_accumulator in the form of [u64;4]
#[wasm_bindgen]
pub fn verify_correct_selector(
    accumulator_hash_js: JsValue,
    row_accumulator_js: JsValue,
    proof_js: JsValue,
) -> bool {
    // verify
    const ROW_NUMBER: usize = 2;

    let k = 10;
    let params: Params<EqAffine> = Params::new(k);

    let accumulator_hash_u32_array = accumulator_hash_js.into_serde::<[u32; 8]>().unwrap();
    let row_accumulator_u32_array = row_accumulator_js.into_serde::<[u32; 8]>().unwrap();

    let accumulator_hash_u64_array = convert_hash_u32_to_u64_LE(accumulator_hash_u32_array);
    let row_accumulator_u64_array = convert_hash_u32_to_u64_LE(row_accumulator_u32_array);

    let proof = proof_js.into_serde::<Vec<u8>>().unwrap();

    let accumulator_hash = Fp::from_raw(accumulator_hash_u64_array);
    let row_accumulator = Fp::from_raw(row_accumulator_u64_array);

    let empty_circuit = FileHashPartialCircuit::<ROW_NUMBER> {
        row_title: [[Value::unknown(); 4]; ROW_NUMBER],
        row_content: [[Value::unknown(); 4]; ROW_NUMBER],
        row_selectors: [Value::unknown(); ROW_NUMBER],
    };

    let vk = keygen_vk(&params, &empty_circuit).expect("keygen_vk should not fail");
    let pk = keygen_pk(&params, vk, &empty_circuit).expect("keygen_pk should not fail");

    let strategy = SingleVerifier::new(&params);
    let mut transcript = Blake2bRead::<_, _, Challenge255<_>>::init(&proof[..]);
    let public_input = vec![accumulator_hash, row_accumulator];

    verify_proof(
        &params,
        pk.get_vk(),
        strategy,
        &[&[&public_input[..]], &[&public_input[..]]],
        &mut transcript,
    )
    .is_ok()
}
