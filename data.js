const shopItems = [
    {
        name: "Моторное масло Shell 5W-40",
        price: 3200,
        unit: "4 л",
        icon: "oil",
        inStock: true
    },
    {
        name: "Воздушный фильтр",
        price: 450,
        unit: "для легковых",
        icon: "filter",
        inStock: true
    },
    {
        name: "Тормозные колодки",
        price: 1800,
        unit: "передняя ось",
        icon: "brake",
        inStock: true
    },
    {
        name: "Лампы H7 галоген",
        price: 350,
        unit: "комплект 2 шт",
        icon: "bulb",
        inStock: true
    },
    {
        name: "Щетки стеклоочистителя",
        price: 600,
        unit: "пара",
        icon: "wiper",
        inStock: true
    },
    {
        name: "Аккумулятор 60 А/ч",
        price: 5500,
        unit: "с установкой",
        icon: "battery",
        inStock: true
    },
    {
        name: "Антифриз красный G12",
        price: 1200,
        unit: "5 л",
        icon: "coolant",
        inStock: true
    },
    {
        name: "Омывайка летняя",
        price: 250,
        unit: "5 л",
        icon: "washer",
        inStock: false
    }
];
const productIcons = {
    oil: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3h-4z"/><path d="M8 5h8l-1 14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2L8 5z"/><path d="M9 9h6"/></svg>`,
    filter: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/><path d="M8 12h8"/></svg>`,
    brake: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 8v8M17 8v8"/><circle cx="12" cy="12" r="2"/></svg>`,
    bulb: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>`,
    wiper: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v14"/><path d="M4 16c0-4 4-8 8-8s8 4 8 8"/><path d="M4 16l-2 4h20l-2-4"/></svg>`,
    battery: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M6 7V5h12v2M8 12h2M14 12h2M10 12v4M14 12v4"/></svg>`,
    coolant: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M7 6h10v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6z"/><path d="M7 10c2 0 3 2 5 2s3-2 5-2"/></svg>`,
    washer: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8v3H8z"/><path d="M6 5h12l-1 16H7L6 5z"/><path d="M9 11v5M15 11v5"/></svg>`
};
const reviews = [
    {
        name: "Алексей",
        car: "Лада Веста",
        rating: 5,
        text: "Приехал с стуком в ходовой, ребята за час нашли причину, поменяли стойки стабилизатора. Цену сказали сразу, по факту не добавили ни копейки. Не разводят на лишний ремонт, редкость сейчас."
    },
    {
        name: "Михаил",
        car: "Ford Focus 2",
        rating: 5,
        text: "Делал шиномонтаж и балансировку, сделали за 40 минут, диски не поцарапали как в прошлом сервисе. Цена вышла ровно как в прайсе на сайте, никаких сюрпризов."
    },
    {
        name: "Сергей",
        car: "Toyota Camry",
        rating: 4,
        text: "Менял масло и все фильтры. Ждал на 20 минут дольше обещанного потому что была очередь, но работу сделали аккуратно, даже под капотом все протерли тряпкой. Нормальный сервис, буду ездить еще."
    },
    {
        name: "Евгений",
        car: "Volkswagen Polo",
        rating: 5,
        text: "Загорелся чек по дороге в город, заехал без записи. Сделали диагностику за 10 минут, оказалось дело в лямбде. Запчасть была в наличии, поменяли там же. Реально выручили."
    },
    {
        name: "Андрей",
        car: "Renault Logan",
        rating: 5,
        text: "Обслуживаю здесь вторую машину уже три года. Никогда не впаривают то что не сломано. Если говорят что деталь отходит еще 20 тысяч — значит так и есть. Нормальные честные мужики."
    },
    {
        name: "Дмитрий",
        car: "Kia Rio",
        rating: 5,
        text: "Сход-развал 3D сделали идеально, руль стоит ровно, машину не тянет никуда. До этого в другом сервисе два раза делали и оба косячили. Цены адекватные, мастера знают свое дело."
    }
];