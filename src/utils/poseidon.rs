use halo2_gadgets::poseidon::{
    primitives::{self as poseidon, ConstantLength, P128Pow5T3},
};
use halo2_proofs::{pasta::Fp, arithmetic::FieldExt};

pub fn get_file_commitment_and_selected_row<const L: usize>(
    row_title: [[Fp; 4]; L],
    row_content: [[Fp; 4]; L],
    row_selector: [Fp; L],
) -> (Fp, Fp) {
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

    // TODO, to test this result
    // let yy = file_commitment.get_lower_128();

    (file_commitment, row_accumulator)
}
