// Maps.js
export const ForestMaps = {
    'forest_1': {
        layout: [
            [0, 0, 5, 5, 22, 5, 5, 0, 0],
            [0, 0, 5, 5, 1, 5, 5, 0, 0],
            [0, 0, 5, 5, 1, 5, 5, 0, 0],
            [0, 0, 5, 5, 1, 5, 5, 0, 0],
            [0, 0, 5, 5, 1, 5, 5, 0, 0],
            [0, 0, 5, 5, 1, 5, 5, 0, 0],
            [0, 0, 5, 5, 21, 5, 5, 0, 0],
        ],
        exits: [
            {
                x: 64 * 4 + 32, y: 64 * 6 + 32,
                target: 'HomeScene', direction: 'down',
                spawnX: 64 * 4 + 32, spawnY: 64 * 0 + 32
            },
            {
                x: 64 * 4 + 32, y: 64 * 0 + 32,
                mapID: 'forest_2',
                target: 'ForestScene', direction: 'up',
                spawnX: 64 * 4 + 32, spawnY: 64 * 6 + 32
            }
        ]
    },
    'forest_2': {
        layout: [
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
            [5, 0, 0, 0, 0, 3, 0, 0, 5],
            [5, 3, 0, 0, 0, 0, 0, 3, 5],
            [33, 0, 0, 0, 0, 0, 0, 0, 34],
            [5, 0, 3, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 0, 3, 0, 5],
            [5, 5, 5, 5, 31, 5, 5, 5, 5],
        ],
        exits: [
            {
                x: 64 * 4 + 32, y: 64 * 6 + 32,
                mapID: 'forest_1',
                target: 'ForestScene', direction: 'down',
                spawnX: 64 * 4 + 32, spawnY: 64 * 0 + 32
            },
            {
                x: 64 * 8 + 32, y: 64 * 3 + 32,
                mapID: 'forest_3',
                target: 'ForestScene', direction: 'right',
                spawnX: 64 * 0 + 32, spawnY: 64 * 3 + 32
            },
            {
                x: 64 * 0 + 32, y: 64 * 3 + 32,
                mapID: 'forest_4',
                target: 'ForestScene', direction: 'left',
                spawnX: 64 * 8 + 32, spawnY: 64 * 3 + 32
            },
        ]
    },
    'forest_3': {
        layout: [
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
            [5, 0, 4, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 4, 0, 0, 0, 5],
            [33, 0, 0, 0, 0, 0, 0, 4, 5],
            [5, 0, 4, 0, 0, 0, 0, 0, 5],
            [5, 0, 0, 0, 0, 4, 0, 0, 5],
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
        ],
        exits: [
            {
                x: 64 * 0 + 32, y: 64 * 3 + 32,
                mapID: 'forest_2',
                target: 'ForestScene', direction: 'left',
                spawnX: 64 * 8 + 32, spawnY: 64 * 3 + 32
            },
        ]
    },
    'forest_4': {
        layout: [
            [4, 0, 0, 5, 32, 5, 0, 2, 0],
            [0, 0, 0, 5, 0, 5, 0, 0, 0],
            [0, 3, 0, 5, 0, 5, 5, 5, 5],
            [0, 0, 0, 5, 0, 0, 0, 0, 34],
            [0, 2, 0, 5, 5, 5, 5, 5, 5],
            [0, 0, 0, 0, 0, 0, 3, 0, 0],
            [0, 0, 0, 4, 0, 0, 0, 0, 0],
        ],
        exits: [
            {
                x: 64 * 8 + 32, y: 64 * 3 + 32,
                mapID: 'forest_2',
                target: 'ForestScene', direction: 'right',
                spawnX: 64 * 0 + 32, spawnY: 64 * 3 + 32
            },
            {
                x: 64 * 4 + 32, y: 64 * 0 + 32,
                target: 'ForestEndScene', direction: 'up',
                spawnX: 64 * 4 + 32, spawnY: 64 * 6 + 32
            },
        ]
    },
};