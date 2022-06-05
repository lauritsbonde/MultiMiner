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
		type = rand < 0.2 ? 'Empty' : rand < 0.3 ? 'Coal' : 'Mud';
	} else if (depth < groundStart + 600) {
		type = rand < 0.1 ? 'Empty' : rand < 0.25 ? 'Coal' : rand < 0.35 ? 'Iron' : 'Mud';
	} else if (depth < groundStart + 1000) {
		type = rand < 0.1 ? 'Empty' : rand < 0.2 ? 'Coal' : rand < 0.35 ? 'Iron' : 'Mud';
	} else if (depth < groundStart + 1500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.15 ? 'Iron' : rand < 0.3 ? 'Gold' : 'Mud';
	} else if (depth < groundStart + 2000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.07 ? 'Iron' : rand < 0.2 ? 'Gold' : rand < 0.35 ? 'Diamond' : 'Mud';
	} else if (depth < groundStart + 2500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.15 ? 'Gold' : rand < 0.25 ? 'Diamond' : rand < 0.4 ? 'Emerald' : 'Mud';
	} else if (depth < groundStart + 3000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Gold' : rand < 0.2 ? 'Diamond' : rand < 0.4 ? 'Emerald' : 'Mud';
	} else if (depth < groundStart + 3500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.15 ? 'Diamond' : rand < 0.25 ? 'Emerald' : rand < 0.4 ? 'Ruby' : 'Mud';
	} else if (depth < groundStart + 4000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Diamond' : rand < 0.2 ? 'Emerald' : rand < 0.4 ? 'Ruby' : 'Mud';
	} else if (depth < groundStart + 4500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.15 ? 'Emerald' : rand < 0.25 ? 'Ruby' : rand < 0.4 ? 'Sapphire' : 'Mud';
	} else if (depth < groundStart + 5000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Emerald' : rand < 0.2 ? 'Ruby' : rand < 0.4 ? 'Sapphire' : 'Mud';
	} else if (depth < groundStart + 5500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Ruby' : rand < 0.25 ? 'Sapphire' : rand < 0.4 ? 'Topaz' : 'Mud';
	} else if (depth < groundStart + 6000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Ruby' : rand < 0.2 ? 'Sapphire' : rand < 0.4 ? 'Topaz' : 'Mud';
	} else if (depth < groundStart + 6500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Sapphire' : rand < 0.25 ? 'Topaz' : rand < 0.4 ? 'Amethyst' : 'Mud';
	} else if (depth < groundStart + 7000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Sapphire' : rand < 0.2 ? 'Topaz' : rand < 0.4 ? 'Amethyst' : 'Mud';
	} else if (depth < groundStart + 7500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Topaz' : rand < 0.25 ? 'Amethyst' : rand < 0.4 ? 'Quartz' : 'Mud';
	} else if (depth < groundStart + 8000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Topaz' : rand < 0.2 ? 'Amethyst' : rand < 0.4 ? 'Quartz' : 'Mud';
	} else if (depth < groundStart + 8500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Amethyst' : rand < 0.25 ? 'Quartz' : rand < 0.4 ? 'Amber' : 'Mud';
	} else if (depth < groundStart + 9000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Amethyst' : rand < 0.2 ? 'Quartz' : rand < 0.4 ? 'Amber' : 'Mud';
	} else if (depth < groundStart + 9500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Quartz' : rand < 0.25 ? 'Amber' : rand < 0.4 ? 'Jade' : 'Mud';
	} else if (depth < groundStart + 10000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Quartz' : rand < 0.2 ? 'Amber' : rand < 0.4 ? 'Jade' : 'Mud';
	} else if (depth < groundStart + 10500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Amber' : rand < 0.25 ? 'Jade' : rand < 0.4 ? 'Pearl' : 'Mud';
	} else if (depth < groundStart + 11000) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Amber' : rand < 0.2 ? 'Jade' : rand < 0.4 ? 'Pearl' : 'Mud';
	} else if (depth < groundStart + 11500) {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Jade' : rand < 0.25 ? 'Pearl' : rand < 0.4 ? 'Opal' : 'Mud';
	} else {
		type = rand < 0.05 ? 'Empty' : rand < 0.1 ? 'Jade' : rand < 0.2 ? 'Pearl' : rand < 0.4 ? 'Opal' : 'Mud';
	}
	return type;
};
