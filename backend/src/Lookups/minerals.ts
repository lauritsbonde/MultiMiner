export const mineralPrices = {
	Mud: 10,
	Coal: 20,
	Iron: 30,
	Gold: 40,
	Diamond: 50,
	Emerald: 60,
	Ruby: 70,
	Sapphire: 80,
	Topaz: 90,
	Amethyst: 100,
	Quartz: 110,
	Amber: 120,
	Jade: 130,
	Pearl: 140,
	Opal: 150,
} as { [type: string]: number };

export const mineralSpawn = (depth: number, groundStart: number) => {
	let type = 'Mud';
	const rand = Math.random();
	if (depth === groundStart) {
		type = rand < 0.2 ? 'Empty' : 'Mud';
	} else if (depth < groundStart + 250) {
		type = rand < 0.2 ? 'Empty' : rand < 0.8 ? 'Mud' : 'Coal';
	} else if (depth < groundStart + 600) {
		type = rand < 0.1 ? 'Empty' : rand < 0.6 ? 'Mud' : rand < 0.8 ? 'Coal' : 'Iron';
	} else if (depth < groundStart + 1000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.25 ? 'Mud' : rand < 0.45 ? 'Coal' : rand < 0.8 ? 'Iron' : 'Gold';
	} else if (depth < groundStart + 1500) {
		type = rand < 0.01 ? 'Empty' : rand < 0.15 ? 'Mud' : rand < 0.35 ? 'Coal' : rand < 0.55 ? 'Iron' : rand < 0.8 ? 'Gold' : 'Diamond';
	} else if (depth < groundStart + 2000) {
		type = rand < 0.01 ? 'Empty' : rand < 0.1 ? 'Mud' : rand < 0.3 ? 'Coal' : rand < 0.5 ? 'Iron' : rand < 0.75 ? 'Gold' : rand < 0.95 ? 'Diamond' : 'Emerald';
	} else if (depth < groundStart + 2500) {
		type = rand < 0.01 ? 'Empty' : rand < 0.1 ? 'Mud' : rand < 0.2 ? 'Coal' : rand < 0.35 ? 'Iron' : rand < 0.5 ? 'Gold' : rand < 0.75 ? 'Diamond' : rand < 0.95 ? 'Emerald' : 'Ruby';
	} else if (depth < groundStart + 3000) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.08
				? 'Mud'
				: rand < 0.15
				? 'Coal'
				: rand < 0.25
				? 'Iron'
				: rand < 0.4
				? 'Gold'
				: rand < 0.6
				? 'Diamond'
				: rand < 0.8
				? 'Emerald'
				: rand < 0.95
				? 'Ruby'
				: 'Sapphire';
	} else if (depth < groundStart + 3500) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.05
				? 'Mud'
				: rand < 0.1
				? 'Coal'
				: rand < 0.2
				? 'Iron'
				: rand < 0.3
				? 'Gold'
				: rand < 0.5
				? 'Diamond'
				: rand < 0.7
				? 'Emerald'
				: rand < 0.9
				? 'Ruby'
				: 'Sapphire';
	} else if (depth < groundStart + 4000) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.04
				? 'Mud'
				: rand < 0.1
				? 'Coal'
				: rand < 0.15
				? 'Iron'
				: rand < 0.2
				? 'Gold'
				: rand < 0.3
				? 'Diamond'
				: rand < 0.4
				? 'Emerald'
				: rand < 0.6
				? 'Ruby'
				: rand < 0.8
				? 'Sapphire'
				: 'Topaz';
	} else if (depth < groundStart + 4500) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.03
				? 'Mud'
				: rand < 0.07
				? 'Coal'
				: rand < 0.1
				? 'Iron'
				: rand < 0.2
				? 'Gold'
				: rand < 0.3
				? 'Diamond'
				: rand < 0.4
				? 'Emerald'
				: rand < 0.5
				? 'Ruby'
				: rand < 0.7
				? 'Sapphire'
				: rand < 0.9
				? 'Topaz'
				: 'Amethyst';
	} else if (depth < groundStart + 5000) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.02
				? 'Mud'
				: rand < 0.05
				? 'Coal'
				: rand < 0.1
				? 'Iron'
				: rand < 0.15
				? 'Gold'
				: rand < 0.2
				? 'Diamond'
				: rand < 0.3
				? 'Emerald'
				: rand < 0.4
				? 'Ruby'
				: rand < 0.5
				? 'Sapphire'
				: rand < 0.6
				? 'Topaz'
				: rand < 0.8
				? 'Amethyst'
				: 'Quartz';
	} else if (depth < groundStart + 5500) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.01
				? 'Mud'
				: rand < 0.04
				? 'Coal'
				: rand < 0.1
				? 'Iron'
				: rand < 0.15
				? 'Gold'
				: rand < 0.2
				? 'Diamond'
				: rand < 0.25
				? 'Emerald'
				: rand < 0.35
				? 'Ruby'
				: rand < 0.5
				? 'Sapphire'
				: rand < 0.6
				? 'Topaz'
				: rand < 0.7
				? 'Amethyst'
				: rand < 0.85
				? 'Quartz'
				: 'Amber';
	} else if (depth < groundStart + 6000) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.01
				? 'Mud'
				: rand < 0.02
				? 'Coal'
				: rand < 0.05
				? 'Iron'
				: rand < 0.1
				? 'Gold'
				: rand < 0.15
				? 'Diamond'
				: rand < 0.2
				? 'Emerald'
				: rand < 0.25
				? 'Ruby'
				: rand < 0.3
				? 'Sapphire'
				: rand < 0.4
				? 'Topaz'
				: rand < 0.5
				? 'Amethyst'
				: rand < 0.6
				? 'Quartz'
				: rand < 0.8
				? 'Amber'
				: 'Jade';
	} else if (depth < groundStart + 6500) {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.01
				? 'Mud'
				: rand < 0.01
				? 'Coal'
				: rand < 0.04
				? 'Iron'
				: rand < 0.1
				? 'Gold'
				: rand < 0.15
				? 'Diamond'
				: rand < 0.2
				? 'Emerald'
				: rand < 0.25
				? 'Ruby'
				: rand < 0.3
				? 'Sapphire'
				: rand < 0.4
				? 'Topaz'
				: rand < 0.5
				? 'Amethyst'
				: rand < 0.6
				? 'Quartz'
				: rand < 0.7
				? 'Amber'
				: rand < 0.85
				? 'Jade'
				: 'Pearl';
	} else {
		type =
			rand < 0.01
				? 'Empty'
				: rand < 0.01
				? 'Mud'
				: rand < 0.01
				? 'Coal'
				: rand < 0.02
				? 'Iron'
				: rand < 0.05
				? 'Gold'
				: rand < 0.1
				? 'Diamond'
				: rand < 0.15
				? 'Emerald'
				: rand < 0.2
				? 'Ruby'
				: rand < 0.3
				? 'Sapphire'
				: rand < 0.4
				? 'Topaz'
				: rand < 0.5
				? 'Amethyst'
				: rand < 0.6
				? 'Quartz'
				: rand < 0.7
				? 'Amber'
				: rand < 0.8
				? 'Jade'
				: rand < 0.9
				? 'Pearl'
				: 'Emerald';
	}
	return type;
};
