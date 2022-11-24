# Zk Form
## Deployment link
https://zkform.vercel.app/

https://file-hasher-78c055.spheron.app

## Problem Statement
Here we have our health certificate. On it, it records our blood type, blood sugar level, medical history and many other health information, some may be too personal to share it to anyone. 

Then, one day for some reason, the blood bank would like to know our blood type and demands to read our latest health record. In normal situation, we commit to the fact that all the details in the health form has been scrutinized by the blood bank, including more sensitive data such as medical history....

What if, there is a way to share only specific data that we want on the health cert without revealing other more personal information?

Such a situation exist not only in the healthcare industry, but think of a business that wants to reveal only a certain transaction that it has performed while hiding other transaction that may relate to its trade secret. Or, showing our future employer our GCPA score on a resume without having reveal how long it takes for us to graduate. 

From the few examples above, we observe that it would be cool to show a part of our documents reliably with the recepient being able to trust the information that we shared, while also having the ability to not share information on the same document that we deem too sensitive.

## High level mechamism
We designed a protocol which involves zero knowledge proof that made the described scenario above possible. The issuer of the document will commit a hash of the document to the blockchain, utilizing blockchain as a settlement layer. The issuer could be the hospital, the university or auditors.
The document is then sent to the owner in plain text. The owner now is reponsibile of storing his/her own data. 
When sharing the public data to the recepient, the owner selected only the information that is shareable, creates a zero knowledge proof that the file hashes to the committed value on the blockchain and that the information indeed is part of the document.
The verifier upon receiving it, compares the commitment hash (public input) to that store on the blockchain and is able to accept (if proof true) or deny (if proof is false).
Our goal is to allow any party to have access to this technology and we created this project as an infrastructure, which allows the underlying zkp to be generic and would be flexible enough.

### Design of the document
A generic form that consist of two columns (one row for title, another row for content). Up to 10 rows.

eg: 
| Title | Content |
| --- | --- |
| Name | CC |
| AGe | xx |
|  |  |

Each row is able to store string of text. The title depends on the use case, for example in a health certificate, we can imagine that there will be row with the title `blood_type` with the `content` A+ for example. This can be as flexible as possible.


### Generation of commitment hash
We utilizes Poseidon hash function as it is a Snark friendly hash function that will allow us to reduce the number of constraints as compared to when we use sha256. 
We perform a double hashing mechanism (i.e horizontal and vertical).

#### Horizontal hashing
| Title | Content | Horizontal Result|
| --- | --- | --- |
| Name | CC |  hash_row_1 |
| AGe | xx | hash_row_2 |
| ... | ... |  ... |

The horizontal hashing hashes the title and content row by row, producing a resultant hash for that row as seen in `Horizontal Result` above.

#### Vertical hashing
| Horizontal Result|
| --- |
|  hash_row_1 |
| hash_row_2 |
|  ... |
| <final accumulated> |

The vertical hashing acts like an accumulator for the horizontal hashing. 
It takes the first two rows, hashes them together and results in the current accumulator. The current accumulator is hashed with the following row and returns the most recent accumulator result. The process repeats until all rows have been hashed.

The result of the accumulated hash will be our commitment hash that we will publish to the block chain.

By publishing on the commitment hash, we are:
1. ensuring that the file in untampered
2. maintain privacy to the content of the file

### Proof generation
The owner of document is able to select one row at a time to reveal (tbd to extend to multiple rows) and will generate a zk proof to proof that the information of the selected row is correct

The public inputs consist of the file commitment and the information of the selected row.

The private inputs will be the content of the entire document and also the `selector_index`, displayed as an array of ones and zeros. One representing the selected row.

### Concurrency management
As our solution is designed to be generic, there may be cases whereby the committed hash changes rather often. As a result, while the prover takes time to generate proof on a commited hash, a new hash overwrites the hash and this will cause the proof verification to fail.
As such, we design a ring buffer data structure to store the commited hash and the verifier is allowed to query the commited hash up to a certain history depth

### Circuit explanation
The private inputs is hashed and is contrainted to the file commitment (public input). This ensure that the file is not tampered.

The selected row is checked by the circuit to ensure that it exist in the document. This is done by comparing the Horizontal hash with the Horizontal hash of our selected row in the public input

Finally, the selector index in also constraint to boolean values to ensure soundness of the proof.

## Benchmark
| Row number | time elapsed (s) |  |  | k |
| --- | --- | --- | --- | --- |
| 2 | 4.88 | 5.14s | 4.82s | 10 |
| 3 | 5.27 | 5.33 | 5.31 | 10 |
| 4 | 8.68 | 8.71 | 8.88 | 11 |
| 5 | 9.20 | 9.19 | 9.29 | 11 |
| 6 | 9.72 | 9.89 | 9.75 | 11 |
| 7 | 16.14 | 15.76 | 15.89 | 12 |
| 8 | 16.90 | 16.30 | 16.69 | 12 |
| 9 | 16.72 | 16.77 | 16.76 | 12 |
| 10 | 17.40 | 17.31 | 17.43 | 12 |
| 11 | 18.32 | 17.89 | 17.80 | 12 |
| 12 | 18.27 | 18.28 | 18.43 | 12 |
| 13 | 30.08 | 30.19 | 29.95 | 13 |
| 14 | 30.43 | 30.63 | 30.93 | 13 |

## Technology used
- Rust for Halo2 libray (ZCash)
- Solidity that is able to deployed on EVM chain (eg. Polygon, Scroll, Ethereum)
- Wasm for proof generation and verification on browser
- Rainbow kit for easy smart contract interaction
- Create react app for frontend

## Future work
- Tooling to allows this infrastucture to be set up easily
- Improve proving time
