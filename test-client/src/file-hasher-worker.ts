import { expose } from "comlink";
import { sha256 } from "js-sha256";

const testProof = [
  105, 30, 113, 180, 96, 217, 2, 160, 28, 246, 84, 91, 150, 203, 17, 76, 130,
  87, 174, 114, 231, 188, 98, 185, 60, 62, 2, 225, 205, 117, 26, 177, 155, 33,
  158, 132, 113, 209, 225, 189, 20, 212, 71, 135, 135, 218, 237, 180, 100, 48,
  143, 185, 63, 97, 68, 62, 244, 177, 72, 170, 167, 59, 252, 16, 124, 225, 17,
  29, 31, 182, 34, 148, 107, 36, 162, 229, 7, 45, 108, 212, 37, 89, 118, 47, 12,
  104, 34, 79, 82, 219, 49, 225, 47, 143, 171, 180, 203, 56, 28, 30, 172, 26,
  138, 198, 54, 186, 173, 107, 81, 19, 69, 67, 117, 126, 144, 90, 120, 5, 57,
  228, 205, 168, 102, 13, 9, 58, 149, 132, 43, 204, 50, 91, 49, 229, 26, 107,
  77, 233, 45, 179, 61, 223, 151, 12, 180, 75, 156, 112, 42, 140, 167, 127, 165,
  183, 129, 109, 96, 73, 56, 12, 186, 102, 8, 171, 98, 182, 219, 212, 193, 227,
  28, 197, 25, 215, 152, 230, 211, 231, 246, 253, 30, 22, 114, 246, 196, 47,
  233, 148, 97, 70, 246, 182, 158, 212, 125, 57, 27, 227, 89, 65, 253, 5, 27,
  115, 118, 122, 241, 92, 151, 120, 58, 168, 201, 125, 131, 25, 76, 55, 232,
  132, 15, 217, 243, 3, 94, 153, 243, 31, 210, 67, 126, 94, 52, 236, 56, 38, 62,
  213, 204, 224, 7, 168, 91, 234, 83, 213, 70, 235, 122, 212, 130, 25, 30, 203,
  121, 155, 103, 144, 214, 126, 213, 9, 25, 179, 235, 229, 65, 232, 20, 111,
  172, 96, 237, 149, 187, 37, 147, 166, 29, 223, 89, 236, 239, 18, 4, 221, 85,
  184, 125, 136, 58, 79, 87, 49, 167, 223, 165, 128, 63, 99, 168, 222, 173, 206,
  214, 247, 112, 150, 12, 245, 51, 219, 237, 182, 107, 42, 28, 211, 236, 184,
  19, 175, 86, 243, 86, 51, 235, 59, 75, 186, 227, 22, 238, 129, 98, 230, 42,
  57, 165, 173, 161, 167, 162, 233, 148, 212, 139, 63, 107, 67, 13, 9, 91, 244,
  81, 22, 47, 114, 253, 159, 195, 50, 137, 37, 196, 50, 128, 253, 200, 176, 168,
  198, 8, 158, 218, 230, 71, 175, 180, 74, 41, 133, 246, 10, 174, 28, 191, 214,
  22, 5, 178, 213, 21, 86, 219, 77, 90, 172, 171, 251, 232, 178, 51, 240, 137,
  3, 247, 51, 146, 189, 0, 255, 179, 177, 221, 165, 204, 226, 57, 133, 208, 248,
  219, 95, 54, 16, 123, 182, 52, 253, 135, 181, 30, 143, 54, 248, 177, 180, 171,
  78, 143, 119, 63, 199, 32, 143, 239, 150, 60, 122, 140, 115, 148, 25, 114,
  151, 192, 79, 225, 64, 113, 147, 204, 235, 25, 250, 245, 135, 93, 223, 241,
  110, 214, 124, 76, 198, 180, 125, 219, 4, 122, 170, 192, 55, 124, 154, 248,
  190, 66, 140, 45, 93, 76, 242, 229, 113, 93, 63, 114, 130, 105, 209, 208, 199,
  187, 160, 93, 158, 14, 74, 198, 176, 223, 204, 186, 150, 195, 35, 180, 226,
  46, 208, 183, 44, 128, 244, 218, 213, 113, 5, 178, 25, 231, 168, 239, 151, 58,
  62, 150, 43, 194, 16, 199, 129, 106, 101, 123, 158, 74, 211, 130, 229, 161,
  200, 248, 149, 248, 165, 240, 113, 205, 229, 155, 213, 27, 72, 38, 166, 92,
  63, 178, 33, 191, 192, 78, 36, 93, 38, 53, 134, 131, 81, 5, 1, 210, 171, 134,
  122, 87, 4, 202, 9, 22, 120, 242, 130, 88, 89, 127, 152, 210, 186, 172, 207,
  187, 132, 228, 40, 0, 25, 184, 2, 61, 181, 9, 25, 237, 238, 19, 37, 148, 231,
  250, 149, 155, 80, 231, 151, 31, 87, 118, 201, 60, 161, 118, 87, 125, 47, 78,
  129, 201, 30, 112, 41, 172, 153, 101, 84, 227, 118, 249, 152, 147, 131, 201,
  83, 235, 247, 10, 113, 120, 167, 10, 173, 194, 125, 96, 83, 145, 130, 33, 184,
  87, 127, 124, 194, 163, 203, 180, 219, 99, 90, 216, 245, 155, 147, 3, 141, 18,
  40, 88, 62, 59, 249, 94, 227, 171, 201, 195, 22, 220, 215, 254, 171, 252, 154,
  249, 179, 204, 11, 36, 27, 209, 191, 93, 134, 227, 76, 171, 101, 151, 226, 90,
  33, 109, 231, 30, 32, 139, 78, 232, 92, 121, 136, 52, 187, 25, 116, 71, 14,
  214, 47, 171, 188, 55, 142, 215, 55, 184, 157, 237, 76, 240, 230, 247, 171,
  134, 127, 82, 61, 103, 151, 147, 83, 205, 124, 30, 129, 241, 230, 48, 61, 13,
  214, 197, 222, 238, 115, 84, 14, 183, 69, 102, 171, 151, 187, 29, 187, 151,
  40, 201, 89, 199, 96, 30, 140, 255, 117, 155, 169, 247, 230, 77, 149, 150,
  243, 58, 203, 77, 111, 47, 87, 14, 126, 217, 248, 141, 86, 4, 59, 124, 38,
  120, 250, 230, 185, 236, 113, 62, 146, 166, 134, 56, 183, 123, 199, 222, 139,
  238, 211, 35, 97, 101, 41, 77, 201, 248, 64, 96, 121, 140, 227, 36, 245, 135,
  252, 186, 31, 94, 127, 122, 68, 51, 149, 170, 181, 136, 229, 233, 180, 223,
  235, 231, 198, 158, 85, 70, 206, 124, 147, 156, 250, 153, 225, 19, 146, 142,
  212, 184, 172, 107, 168, 144, 66, 109, 136, 109, 38, 225, 187, 214, 38, 117,
  35, 34, 75, 248, 145, 17, 156, 149, 158, 111, 92, 17, 52, 224, 134, 81, 115,
  16, 193, 102, 177, 212, 204, 118, 185, 118, 188, 2, 44, 32, 205, 132, 180,
  235, 3, 91, 105, 16, 138, 181, 201, 56, 103, 52, 213, 141, 176, 166, 251, 132,
  5, 1, 241, 154, 5, 226, 171, 242, 98, 182, 112, 217, 136, 156, 43, 210, 5, 36,
  37, 108, 35, 10, 222, 20, 28, 237, 241, 15, 226, 3, 188, 54, 220, 201, 24, 85,
  78, 41, 53, 242, 98, 182, 112, 217, 136, 156, 43, 210, 5, 36, 37, 108, 35, 10,
  222, 20, 28, 237, 241, 15, 226, 3, 188, 54, 220, 201, 24, 85, 78, 41, 53, 216,
  185, 28, 17, 65, 100, 42, 29, 176, 217, 220, 150, 197, 115, 102, 61, 75, 221,
  10, 18, 53, 122, 108, 200, 130, 158, 24, 133, 157, 17, 17, 37, 143, 105, 153,
  133, 69, 149, 204, 255, 120, 50, 172, 73, 21, 227, 42, 225, 174, 106, 91, 191,
  138, 130, 150, 33, 138, 87, 110, 99, 61, 191, 41, 25, 138, 8, 250, 136, 165,
  108, 178, 62, 4, 192, 69, 156, 107, 48, 16, 155, 154, 98, 175, 226, 250, 202,
  173, 238, 93, 223, 12, 184, 55, 68, 31, 59, 123, 99, 161, 194, 45, 197, 75,
  109, 86, 188, 75, 12, 46, 255, 46, 40, 161, 61, 172, 99, 159, 217, 251, 58,
  143, 146, 135, 120, 122, 235, 5, 21, 40, 150, 178, 42, 33, 5, 153, 78, 237,
  251, 128, 26, 213, 72, 253, 228, 155, 169, 10, 48, 28, 228, 71, 119, 18, 191,
  70, 62, 88, 133, 235, 49, 118, 198, 5, 19, 178, 120, 21, 127, 224, 214, 75,
  131, 151, 38, 177, 200, 149, 87, 121, 190, 96, 63, 28, 17, 253, 105, 129, 82,
  55, 223, 213, 10, 59, 70, 203, 169, 243, 83, 199, 180, 22, 100, 214, 159, 244,
  237, 251, 123, 7, 26, 205, 241, 78, 232, 9, 25, 141, 183, 70, 231, 9, 100,
  216, 20, 203, 124, 99, 0, 97, 152, 203, 32, 30, 46, 186, 158, 17, 154, 152,
  146, 56, 185, 10, 53, 140, 31, 217, 86, 214, 163, 80, 10, 220, 222, 148, 1,
  252, 116, 242, 228, 203, 164, 47, 140, 250, 99, 17, 92, 144, 91, 65, 0, 123,
  170, 209, 226, 77, 90, 224, 19, 42, 52, 147, 112, 234, 89, 136, 53, 178, 0,
  51, 167, 92, 196, 30, 26, 73, 205, 1, 34, 3, 77, 28, 194, 205, 144, 103, 163,
  58, 155, 190, 194, 160, 78, 188, 40, 71, 73, 156, 32, 52, 161, 208, 100, 94,
  206, 161, 168, 46, 5, 120, 81, 193, 90, 248, 32, 192, 144, 26, 147, 170, 250,
  119, 160, 181, 126, 109, 177, 27, 64, 4, 23, 14, 74, 233, 96, 255, 45, 48, 10,
  57, 188, 251, 161, 246, 234, 189, 94, 62, 138, 91, 203, 255, 177, 149, 232,
  249, 43, 198, 187, 143, 141, 54, 46, 38, 56, 88, 187, 197, 170, 1, 84, 47, 98,
  63, 134, 33, 73, 221, 1, 142, 203, 59, 114, 162, 17, 184, 245, 113, 129, 244,
  202, 67, 40, 107, 15, 180, 53, 68, 0, 39, 102, 23, 20, 28, 5, 244, 28, 140,
  123, 243, 66, 33, 36, 143, 44, 152, 96, 219, 146, 51, 16, 138, 156, 96, 222,
  68, 10, 62, 254, 10, 212, 204, 49, 206, 138, 116, 111, 87, 140, 96, 4, 239,
  109, 169, 91, 177, 137, 237, 90, 59, 160, 26, 148, 112, 64, 6, 99, 120, 41,
  201, 120, 198, 115, 176, 227, 236, 92, 3, 98, 6, 234, 231, 143, 213, 199, 182,
  50, 208, 138, 88, 119, 74, 27, 124, 44, 126, 246, 80, 215, 241, 39, 87, 194,
  206, 165, 97, 112, 132, 184, 239, 88, 36, 79, 64, 154, 71, 163, 127, 154, 30,
  123, 85, 167, 191, 87, 226, 173, 192, 249, 36, 169, 134, 11, 214, 169, 212,
  114, 110, 4, 129, 60, 62, 210, 12, 119, 71, 41, 159, 100, 223, 220, 174, 81,
  250, 105, 172, 218, 73, 189, 98, 35, 197, 134, 74, 28, 198, 61, 37, 134, 232,
  68, 107, 163, 31, 208, 60, 195, 227, 216, 148, 144, 131, 153, 22, 170, 103,
  54, 14, 54, 41, 131, 119, 158, 92, 193, 78, 38, 151, 93, 242, 124, 215, 227,
  121, 56, 14, 33, 16, 13, 201, 117, 208, 16, 146, 147, 3, 95, 117, 210, 152, 4,
  104, 103, 175, 191, 33, 187, 82, 18, 107, 139, 45, 101, 131, 18, 240, 123,
  165, 83, 32, 236, 42, 239, 69, 237, 188, 187, 224, 60, 221, 175, 55, 79, 247,
  206, 205, 134, 189, 173, 54, 59, 15, 75, 230, 116, 182, 103, 168, 141, 24,
  165, 149, 57, 180, 46, 212, 45, 144, 236, 172, 27, 6, 38, 212, 138, 79, 83,
  69, 143, 140, 6, 227, 9, 254, 56, 189, 106, 224, 253, 32, 19, 200, 71, 41,
  113, 38, 91, 249, 147, 31, 164, 122, 79, 94, 91, 168, 34, 135, 95, 33, 51, 19,
  21, 210, 36, 27, 0, 6, 93, 210, 176, 223, 15, 119, 205, 18, 50, 152, 48, 16,
  56, 127, 253, 231, 214, 67, 144, 158, 34, 109, 86, 35, 89, 168, 199, 126, 58,
  229, 235, 18, 27, 120, 56, 179, 221, 19, 92, 181, 10, 59, 184, 132, 84, 93,
  206, 89, 16, 239, 89, 172, 245, 191, 72, 125, 243, 126, 122, 97, 37, 99, 224,
  224, 15, 37, 180, 65, 66, 135, 186, 225, 51, 27, 75, 190, 217, 118, 143, 139,
  62, 210, 3, 204, 69, 79, 173, 45, 147, 132, 53, 233, 29, 222, 84, 102, 136,
  147, 38, 218, 221, 130, 149, 100, 199, 181, 105, 242, 209, 55, 16, 233, 84,
  110, 251, 177, 63, 145, 106, 235, 230, 223, 90, 143, 62, 189, 183, 186, 226,
  236, 146, 207, 184, 165, 196, 25, 43, 210, 181, 233, 230, 250, 51, 219, 223,
  230, 97, 190, 134, 154, 208, 212, 145, 55, 98, 216, 51, 47, 4, 150, 192, 2,
  38, 44, 204, 96, 58, 116, 39, 192, 113, 7, 182, 181, 67, 145, 207, 246, 16,
  107, 227, 177, 103, 198, 112, 194, 202, 241, 22, 241, 134, 250, 100, 201, 53,
  74, 81, 139, 125, 253, 213, 57, 36, 132, 219, 8, 173, 135, 217, 115, 139, 239,
  14, 254, 101, 46, 249, 163, 172, 181, 33, 182, 169, 250, 43, 1, 241, 171, 152,
  103, 139, 107, 43, 80, 93, 144, 179, 125, 25, 99, 216, 147, 239, 206, 136, 63,
  219, 43, 185, 26, 187, 221, 49, 109, 54, 18, 74, 37, 80, 249, 163, 156, 163,
  121, 209, 146, 211, 121, 110, 68, 158, 198, 41, 47, 17, 64, 224, 245, 135, 89,
  16, 17, 100, 131, 59, 225, 58, 140, 197, 38, 189, 113, 211, 246, 13, 150, 167,
  125, 120, 55, 27, 36, 129, 85, 40, 9, 174, 157, 41, 183, 103, 87, 31, 68, 240,
  81, 29, 124, 199, 171, 194, 206, 175, 230, 144, 165, 162, 16, 124, 202, 153,
  250, 31, 4, 93, 117, 174, 144, 31, 122, 73, 128, 213, 58, 249, 99, 106, 141,
  4, 128, 224, 157, 67, 221, 2, 38, 86, 64, 99, 95, 254, 213, 86, 30, 17, 113,
  209, 201, 118, 246, 87, 40, 160, 35, 253, 140, 31, 96, 120, 104, 1, 187, 72,
  44, 167, 144, 166, 40, 148, 183, 51, 173, 120, 9, 191, 136, 118, 3, 42, 66,
  243, 203, 10, 137, 254, 6, 111, 248, 56, 143, 174, 102, 58, 116, 89, 77, 238,
  143, 252, 244, 149, 142, 167, 100, 134, 166, 220, 73, 244, 53, 102, 187, 164,
  133, 126, 131, 22, 204, 233, 32, 37, 42, 102, 43, 12, 175, 52, 45, 27, 35,
  194, 40, 228, 6, 243, 163, 23, 31, 168, 74, 177, 228, 119, 247, 13, 163, 77,
  136, 2, 64, 242, 46, 149, 143, 172, 12, 53, 103, 115, 9, 161, 249, 78, 137,
  143, 33, 43, 163, 24, 76, 7, 83, 126, 45, 116, 55, 209, 133, 216, 6, 43, 14,
  57, 217, 152, 170, 181, 44, 7, 211, 226, 206, 175, 159, 123, 105, 174, 135,
  72, 134, 245, 87, 48, 188, 113, 158, 190, 61, 128, 8, 227, 205, 72, 147, 238,
  57, 149, 179, 154, 58, 61, 138, 5, 223, 121, 102, 90, 236, 126, 234, 179, 221,
  230, 14, 154, 190, 52, 101, 169, 195, 15, 3, 174, 91, 76, 15, 101, 103, 171,
  239, 97, 171, 54, 227, 174, 133, 86, 207, 65, 221, 103, 71, 233, 217, 175, 86,
  64, 148, 54, 35, 217, 55, 128, 86, 164, 19, 26, 238, 53, 138, 41, 140, 131,
  123, 31, 189, 236, 63, 167, 58, 74, 65, 118, 59, 175, 5, 189, 86, 121, 97,
  147, 117, 153, 109, 221, 68, 121, 248, 168, 209, 91, 15, 127, 31, 20, 168, 18,
  221, 144, 163, 93, 215, 214, 124, 230, 217, 12, 58, 70, 205, 192, 88, 203, 58,
  123, 57, 125, 210, 128, 199, 12, 17, 31, 50, 128, 92, 165, 177, 18, 231, 234,
  238, 109, 37, 233, 155, 61, 222, 100, 195, 23, 218, 26, 152, 206, 94, 119,
  245, 17, 242, 201, 58, 118, 73, 244, 175, 5, 193, 6, 117, 11, 145, 37, 25,
  222, 181, 229, 185, 44, 245, 66, 111, 79, 206, 30, 8, 200, 134, 158, 141, 108,
  112, 115, 74, 165, 88, 120, 84, 51, 129, 120, 84, 58, 38, 129, 177, 180, 36,
  109, 114, 173, 127, 98, 251, 203, 26, 109, 26, 241, 77, 228, 119, 80, 136,
  206, 195, 85, 20, 18, 2, 75, 228, 133, 178, 59, 161, 67, 203, 27, 10, 130, 33,
  76, 34, 215, 24, 97, 178, 18, 39, 8, 7, 60, 35, 189, 129, 131, 62, 231, 76,
  145, 33, 132, 93, 58, 33, 14, 254, 254, 111, 64, 166, 114, 161, 22, 131, 18,
  59, 183, 138, 121, 19, 208, 34, 23, 65, 19, 180, 226, 162, 175, 163, 100, 129,
  223, 125, 67, 61, 21, 84, 104, 237, 17, 78, 185, 177, 179, 93, 147, 127, 10,
  197, 248, 253, 252, 79, 213, 72, 171, 135, 179, 55, 71, 103, 69, 236, 36, 151,
  105, 92, 13, 146, 172, 171, 15, 156, 226, 118, 22, 25, 111, 62, 88, 111, 25,
  70, 72, 40, 56, 138, 234, 94, 74, 41, 248, 200, 188, 169, 56, 169, 33, 191,
  39, 198, 18, 5, 183, 81, 64, 49, 229, 76, 18, 45, 24, 102, 199, 153, 213, 227,
  51, 115, 71, 9, 205, 187, 149, 238, 180, 149, 102, 21, 14, 37, 53, 184, 84,
  145, 204, 124, 53, 200, 106, 112, 115, 234, 242, 174, 220, 222, 95, 61, 62,
  152, 52, 201, 72, 218, 156, 54, 21, 33, 174, 14, 174, 254, 41, 190, 23, 54,
  180, 153, 176, 55, 239, 106, 51, 134, 226, 1, 197, 78, 86, 196, 2, 245, 241,
  42, 177, 113, 6, 184, 145, 227, 76, 170, 169, 150, 53, 219, 31, 39, 32, 38,
  110, 166, 56, 171, 190, 44, 127, 91, 163, 142, 186, 22, 124, 68, 184, 237,
  202, 78, 132, 186, 77, 88, 45, 186, 228, 200, 40, 31, 98, 177, 181, 163, 37,
  16, 239, 48, 198, 67, 101, 42, 115, 127, 98, 174, 41, 46, 79, 169, 101, 120,
  248, 15, 43, 126, 226, 123, 16, 60, 15, 65, 255, 102, 19, 116, 201, 53, 189,
  208, 134, 96, 254, 25, 157, 157, 170, 158, 234, 1, 135, 179, 71, 51, 29, 70,
  50, 72, 151, 149, 114, 103, 52, 215, 62, 81, 126, 154, 135, 213, 220, 181,
  166, 113, 137, 76, 107, 65, 179, 21, 119, 70, 131, 103, 240, 6, 69, 154, 243,
  5, 141, 32, 50, 201, 4, 246, 229, 205, 116, 70, 135, 13, 43, 163, 162, 140,
  78, 248, 152, 130, 184, 244, 126, 227, 74, 128, 116, 13, 164, 207, 233, 22,
  31, 209, 91, 83, 55, 249, 129, 145, 46, 142, 242, 18, 247, 180, 205, 4, 37,
  86, 37, 251, 141, 182, 16, 32, 159, 134, 99, 252, 242, 89, 184, 161, 7, 144,
  170, 67, 50, 86, 121, 202, 10, 111, 241, 193, 218, 166, 189, 219, 40, 186, 25,
  202, 203, 125, 2, 135, 227, 201, 42, 4, 81, 144, 139, 251, 237, 49, 128, 229,
  45, 118, 21, 6, 241, 221, 86, 130, 31, 8, 163, 157, 63, 98, 177, 118, 135,
  162, 149, 112, 183, 217, 194, 89, 23, 24, 217, 142, 214, 219, 45, 219, 21,
  102, 198, 18, 190, 178, 67, 214, 82, 234, 164, 166, 33, 249, 200, 215, 73, 92,
  10, 178, 228, 176, 129, 26, 93, 181, 58, 144, 206, 90, 125, 1, 1, 150, 28,
  178, 154, 167, 221, 83, 56, 94, 159, 222, 23, 84, 90, 44, 106, 95, 22, 250,
  182, 201, 237, 246, 136, 194, 139, 222, 231, 80, 167, 30, 48, 191, 250, 34,
  147, 47, 223, 111, 33, 174, 164, 179, 37, 32, 198, 244, 220, 158, 53, 102, 7,
  234, 227, 120, 119, 83, 246, 92, 164, 110, 226, 182, 58, 192, 188, 136, 124,
  144, 186, 117, 209, 127, 167, 202, 23, 44, 248, 255, 107, 200, 6, 154, 221,
  208, 63, 177, 152, 209, 100, 183, 125, 148, 151, 7, 46, 7, 20, 118, 63, 139,
  222, 13, 233, 215, 194, 231, 122, 164, 249, 68, 37, 131, 215, 2, 80, 27, 123,
  195, 86, 89, 151, 218, 125, 189, 68, 55, 35, 135, 98, 209, 34, 181, 254, 75,
  86, 71, 218, 92, 209, 28, 228, 12, 123, 251, 97, 102, 116, 20, 55, 209, 202,
  204, 134, 172, 170, 43, 185, 147, 61, 103, 116, 117, 216, 219, 74, 83, 192,
  139, 224, 109, 68, 245, 4, 111, 139, 217, 181, 171, 127, 176, 227, 116, 68,
  156, 74, 168, 100, 225, 52, 189, 24, 67, 65, 34, 56, 144, 251, 204, 149, 37,
  218, 249, 27, 186, 170, 252, 3, 30, 55, 8, 197, 148, 206, 6, 3, 116, 31, 156,
  163, 181, 95, 74, 189, 110, 162, 75, 100, 63, 100, 153, 33, 158, 212, 60, 82,
  125, 42, 242, 170, 249, 86, 235, 93, 121, 151, 110, 96, 90, 79, 27, 231, 42,
  202, 96, 58, 68, 64, 203, 188, 192, 119, 146, 255, 210, 7, 107, 195, 222, 136,
  11, 167, 197, 164, 55, 179, 239, 35, 98, 245, 207, 242, 17, 44, 82, 234, 177,
  39, 126, 128, 29, 149, 49, 87, 59, 138, 91, 79, 208, 68, 70, 67, 18, 176, 85,
  60, 121, 39, 54, 125, 167, 100, 168, 130, 220, 50, 103, 134, 12, 19, 117, 221,
  190, 97, 138, 243, 241, 130, 128, 45, 54, 229, 147, 63, 70, 48, 192, 143, 67,
  88, 13, 14, 234, 36, 102, 236, 1, 228, 169, 144, 31, 44, 107, 241, 18, 122,
  33, 85, 102, 202, 241, 217, 173, 206, 47, 131, 172, 158, 168, 52, 134, 75,
  255, 62, 134, 125, 168, 194, 212, 223, 220, 179, 20, 11, 149, 54, 211, 174,
  180, 102, 150, 180, 211, 80, 240, 190, 121, 16, 215, 36, 41, 155, 125, 233,
  15, 201, 40, 254, 232, 116, 66, 33, 180, 25, 66, 150, 232, 150, 128, 191, 109,
  209, 228, 235, 11, 20, 126, 56, 150, 61, 59, 97, 188, 140, 211, 187, 228, 106,
  98, 72, 158, 1, 216, 90, 78, 102, 212, 46, 152, 237, 212, 6, 50, 129, 171,
  129, 117, 149, 120, 208, 217, 214, 48, 86, 34, 47, 94, 240, 60, 124, 146, 200,
  252, 178, 199, 147, 227, 140, 25, 149, 128, 172, 44, 221, 124, 85, 50, 43,
  199, 7, 150, 59, 180, 129, 129, 139, 144, 175, 129, 252, 69, 217, 123, 74, 47,
  71, 189, 96, 109, 217, 183, 57, 32, 14, 54, 126, 254, 166, 80, 176, 25, 129,
  45, 87, 153, 205, 95, 200, 228, 248, 95, 74, 61, 98, 237, 226, 97, 62, 197,
  94, 13, 38, 254, 175, 227, 127, 223, 177, 194, 2, 234, 26, 17, 221, 41, 104,
  33, 52, 64, 190, 8, 51, 75, 63, 60, 29, 89, 129, 36, 194, 86, 82, 52, 72, 140,
  13, 125, 14, 144, 15, 28, 175, 147, 248, 36, 131, 118, 56, 138, 148, 149, 249,
  164, 157, 161, 149, 50, 86, 11, 16, 100, 71, 192, 240, 140, 15, 187, 54, 217,
  212, 200, 8, 132, 123, 36, 42, 213, 33, 83, 117, 150, 79, 168, 84, 50, 152,
  134, 251, 108, 180, 20, 39, 147, 44, 88, 185, 202, 169, 49, 129, 185, 216,
  101, 1, 46, 238, 90, 200, 2, 186, 197, 151, 147, 197, 124, 26, 182, 122, 142,
  61, 240, 99, 25, 157, 10, 16, 130, 188, 245, 145, 204, 25, 134, 198, 114, 96,
  162, 252, 35, 91, 119, 116, 18, 63, 229, 25, 142, 179, 221, 226, 53, 84, 232,
  187, 85, 224, 175, 236, 207, 125, 171, 144, 221, 5, 44, 83, 192, 50, 69, 252,
  77, 200, 244, 54, 207, 11, 82, 229, 170, 92, 244, 202, 113, 6, 61, 168, 94,
  16, 113, 126, 201, 57, 202, 215, 90, 162, 137, 53, 253, 210, 156, 104, 239,
  200, 160, 75, 98, 241, 220, 203, 229, 221, 14, 249, 173, 69, 48, 46, 82, 75,
  186, 28, 128, 170, 201, 108, 153, 17, 128, 117, 163, 62, 125, 161, 229, 127,
  177, 39, 101, 142, 56, 5, 113, 104, 77, 244, 20, 180, 106, 127, 220, 50, 128,
  104, 108, 12, 153, 104, 20, 60, 225, 233, 189, 109, 65, 62, 151, 20, 165, 102,
  86, 96, 208, 16, 11, 200, 172, 214, 161, 212, 152, 175, 65, 53, 250, 35, 253,
  186, 57, 193, 98, 139, 39, 65, 214, 146, 12, 104, 90, 236, 155, 79, 89, 202,
  246, 52, 166, 4, 88, 49, 15, 207, 145, 107, 100, 100, 120, 46, 175, 102, 0,
  197, 50, 135, 114, 56, 141, 212, 178, 247, 194, 178, 51, 213, 34, 8, 58, 200,
  201, 113, 89, 126, 4, 160, 204, 68, 238, 196, 170, 76, 27, 103, 36, 222, 41,
  44, 29, 185, 74, 176, 88, 58, 73, 141, 145, 223, 56, 85, 39, 37, 27, 36, 191,
  26, 83, 224, 26, 116, 22, 230, 45, 100, 32, 198, 202, 164, 165, 4, 188, 120,
  146, 223, 104, 196, 84, 28, 153, 218, 162, 190, 123, 108, 81, 225, 26, 142,
  143, 76, 40, 15, 17, 32, 242, 208, 43, 214, 190, 94, 96, 59, 29, 223, 88, 43,
  137, 118, 15, 65, 23, 108, 204, 1, 72, 58, 132, 203, 4, 201, 84, 117, 178,
  155, 252, 187, 62, 151, 177, 195, 187, 18, 103, 133, 135, 82, 250, 36, 169,
  175, 56, 188, 45, 255, 83, 9, 201, 61, 195, 98, 191, 63, 128, 198, 122, 158,
  159, 157, 151, 226, 202, 196, 69, 196, 252, 171, 104, 142, 60, 195, 209, 237,
  212, 174, 250, 244, 254, 51, 36, 94, 97, 222, 227, 86, 238, 167, 9, 220, 220,
  76, 50, 169, 206, 80, 158, 225, 111, 27, 27, 90, 7, 235, 216, 14, 194, 132,
  144, 205, 213, 135, 91, 230, 97, 38, 21, 209, 114, 111, 223, 116, 177, 140,
  222, 225, 216, 62, 249, 108, 134, 16,
];

// create a form (20 rows)
const rowTitles = [
  "1",
  "1",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  // "11",
  // "12",
  // "13",
  // "14",
  // "15",
  // "16",
  // "17",
  // "18",
  // "19",
  // "20",
];
const rowContent = [
  "1",
  "1",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  // "11",
  // "12",
  // "13",
  // "14",
  // "15",
  // "16",
  // "17",
  // "18",
  // "19",
  // "20",
];

// async function testAllFlow2() {
//   debugger;
//   const multiThread = await import("file-hasher");
//   await multiThread.default();
//   await multiThread.initThreadPool(navigator.hardwareConcurrency);

//   const shaRes = sha256("hello");
//   const hash = convertSha256HexToU32(shaRes);
//   const hash2 = convertSha256HexToU64(shaRes);
//   const ret = multiThread.wasm_test();
// }

const convertStringToU32 = (input: string) => {
  const shaRes = sha256(input);
  return convertSha256HexToU32(shaRes);
};

async function testAllFlow() {
  debugger;
  const multiThread = await import("file-hasher");
  await multiThread.default();
  await multiThread.initThreadPool(navigator.hardwareConcurrency);
  //   multiThread.init_panic_hook();

  // create sha256 entry for each row_title and row_content
  // split each sha256 to 4 u64 numbers
  const rowTitlesU32 = rowTitles.map((x) => {
    return convertStringToU32(x);
  });
  const rowContentU32 = rowContent.map((x) => {
    return convertStringToU32(x);
  });

  // create selector
  const selectedRowIndex = 0;
  const rowSelector = Array(10).fill(0);
  rowSelector[selectedRowIndex] = 1; // selecting the first entry
  const rowHashHex = multiThread.generate_row_hash(
    rowTitlesU32[selectedRowIndex],
    rowContentU32[selectedRowIndex]
  );

  const [fileCommitmentHex, selectedRowHex] =
    multiThread.get_file_commitment_and_selected_row(
      rowTitlesU32,
      rowContentU32,
      rowSelector
    );

  const proof = multiThread.generate_proof(
    rowTitlesU32,
    rowContentU32,
    rowSelector
  ); // [u8]

  const selectedRowHex2 = multiThread.get_selected_row(
    convertStringToU32(rowTitles[selectedRowIndex]),
    convertStringToU32(rowContent[selectedRowIndex])
  );

  const fileCommitmentU32 = convertSha256HexToU32(fileCommitmentHex);
  const selectedRowU32 = convertSha256HexToU32(selectedRowHex2);
  const verifyResult = multiThread.verify_correct_selector(
    fileCommitmentU32,
    selectedRowU32,
    proof
  );

  console.log(`verifyResult : ${verifyResult}`);
}

const convertSha256HexToU64 = (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hash.slice(2);
  }

  let res = [];
  const partLength = 256 / 4 / 4;

  for (let i = 0; i < 4; i++) {
    let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
    let x = BigInt("0x" + currentWord);
    // let x = parseInt(currentWord, 16);
    res.push(x);
  }

  return res;
};

const convertSha256HexToU32 = (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hash.slice(2);
  }

  let res = [];
  const partLength = 256 / 4 / 4 / 2;

  for (let i = 0; i < 8; i++) {
    let currentWord = hash.slice(i * partLength, (i + 1) * partLength);
    let x = parseInt(currentWord, 16);
    res.push(x);
  }

  return res;
};

const convertLEBitsToHex = (bitArray: number[]) => {
  let totalLength = bitArray.length;

  let hexString = "";
  const bitsInHex = 4;

  let currentCount = 0;
  for (let i = 0; i < totalLength; i++) {
    const powerOf = i % bitsInHex;
    currentCount += bitArray[i] ** powerOf;

    if (powerOf === bitsInHex - 1) {
      const hexChar = currentCount.toString(16);
      hexString.concat(hexChar);

      currentCount = 0;
    }
  }

  return hexString;
};

// async function get_play_diff() {
//     console.log('diffing');
//     const multiThread = await import('file-hasher');
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     multiThread.init_panic_hook();
//     const ret = multiThread.get_play_diff("fluff", ["fluff", "fluff", "fluff", "fluff", "fluff", "fluff"]);
//     return ret;
// }

// async function fetch_params() {
//     const response = await fetch('http://localhost:3000/params.bin');
//     const bytes = await response.arrayBuffer();
//     const params = new Uint8Array(bytes);
//     return params;
// }

// async function prove_play() {
//     const params = await fetch_params();
//     console.log("param length", params.length);
//     console.log("params", params);

//     console.log('genning proof');
//     const multiThread = await import(
//         'halowordle'
//       );
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     console.log('here we go');
//     const ret = multiThread.prove_play("fluff", ["fluff", "fluff", "fluff", "fluff", "fluff", "fluff"], params);
//     return ret;
// }

// async function verify_play(proof: any, diffs_js: any) {
//     const params = await fetch_params();
//     console.log("param length", params.length);
//     console.log("params", params);

//     console.log('verifying proof');
//     const multiThread = await import(
//         'halowordle'
//       );
//     await multiThread.default();
//     await multiThread.initThreadPool(navigator.hardwareConcurrency);
//     console.log('here we go');
//     const ret = multiThread.verify_play("fluff", proof, diffs_js, params);
//     return ret;
// }

const exports = {
  testAllFlow,
};
export type FileHasherWorker = typeof exports;

expose(exports);
