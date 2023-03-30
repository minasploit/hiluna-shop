import Hashids from 'hashids'
const hashids = new Hashids('hilunart', 5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789')

export const hashId = {
	encode: (id: number) => {
		return hashids.encode(id);
	},

	decode: (id: string) => {
		return (hashids.decode(id)[0] as number)
	},

	safeDecode: (id: string | undefined | null) => {
		if (id === null) {
			return null;
		}
		else if (id === undefined) {
			return undefined;
		}
		try {
			return (hashids.decode(id)[0] as number)
		}
		catch {
			return undefined;
		}
	},
};