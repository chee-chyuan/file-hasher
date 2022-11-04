use crate::gadgets::poseidon::{PoseidonChip as Chip, PoseidonConfig as Config};
use halo2_gadgets::poseidon::primitives::P128Pow5T3;
use halo2_proofs::{
    circuit::{floor_planner::V1, Value},
    pasta::Fp,
    plonk::{Circuit, Column, ConstraintSystem, Instance},
};

#[derive(Clone)]
struct PoseidonConfig {
    instance: Column<Instance>,
    poseidon_config: Config<3, 2, 2>,
}

struct PoseidonChip {
    config: PoseidonConfig,
}

impl PoseidonChip {
    pub fn construct(config: PoseidonConfig) -> Self {
        Self { config }
    }

    pub fn configure(meta: &mut ConstraintSystem<Fp>) -> PoseidonConfig {
        let instance = meta.instance_column();
        meta.enable_equality(instance);

        let state = (0..3).map(|_| meta.advice_column()).collect::<Vec<_>>();
        for i in 0..3 {
            meta.enable_equality(state[i]);
        }

        let poseidon_config = Chip::<P128Pow5T3, 3, 2, 2>::configure(meta, state);

        PoseidonConfig {
            instance,
            poseidon_config,
        }
    }
}

#[derive(Default)]
struct PoseidonCircuit {
    a: Value<Fp>,
    b: Value<Fp>,
}

impl Circuit<Fp> for PoseidonCircuit {
    type Config = PoseidonConfig;

    type FloorPlanner = V1;

    fn without_witnesses(&self) -> Self {
        Self::default()
    }

    fn configure(meta: &mut ConstraintSystem<Fp>) -> Self::Config {
        PoseidonChip::configure(meta)
    }

    fn synthesize(
        &self,
        config: Self::Config,
        mut layouter: impl halo2_proofs::circuit::Layouter<Fp>,
    ) -> Result<(), halo2_proofs::plonk::Error> {
        let poseidon_cs = Chip::<P128Pow5T3, 3, 2, 2>::construct(config.poseidon_config);

        let message = [self.a, self.b];
        // let poseidon_chip = PoseidonChip::<S, WIDTH, RATE, L>::construct(config);
        let message_cells = poseidon_cs
            .load_private_inputs(layouter.namespace(|| "load private inputs"), message)?;
        let result = poseidon_cs.hash(layouter.namespace(|| "poseidon chip"), &message_cells)?;

        layouter.constrain_instance(result.cell(), config.instance, 0)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use ff::PrimeFieldBits;
    use halo2_gadgets::poseidon::{
        primitives::{self as poseidon, ConstantLength, P128Pow5T3, Spec},
        Hash,
    };
    use halo2_proofs::{arithmetic::FieldExt, circuit::Value, dev::MockProver, pasta::Fp};

    use super::PoseidonCircuit;

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

    #[test]
    fn test() {
        let k = 8;
        let a = Fp::from(5);
        let b = Fp::from(7);

        let circuit = PoseidonCircuit {
            a: Value::known(a),
            b: Value::known(b),
        };

        let message = [a, b];

        let output = poseidon::Hash::<_, P128Pow5T3, ConstantLength<2>, 3, 2>::init().hash(message);

        println!("output Fp: {:?}", output);
        println!("output Fp: {:?}", format!("{:?}", output));
        println!("output u128: {:?}", output.get_lower_128());
        println!("output bits: {:?}", output.to_le_bits());
        println!(
            "output bits raw slice: {:?}",
            output.to_le_bits().as_raw_slice()
        );
        println!(
            "output bits raw slice u32: {:?}",
            convert_hash_u64_to_u32(output.to_le_bits().as_raw_slice().try_into().unwrap())
        );
        let output_le_bits2 = output.to_le_bits();
        let output_le_bits = output.to_le_bits().as_raw_slice();

        let test_fp = Fp::from_raw([1, 3, 4, 5]);

        let pub_instance = vec![output];

        let prover = MockProver::run(k, &circuit, vec![pub_instance]).unwrap();
        prover.assert_satisfied();
    }
}
