const tknConfig = require('../../src/config').security.jwt.accessToken;
const randPasswords = [
    'Bee12!!#132',
    'Prototype51!!#2381313',
    'JavaScript123##123812!'
];
const randTasks = [
    'Get milk',
    'Walk the dog',
    'Work out and take a shower'
];


let count = 0;

exports.authHeader = tknConfig.extract.header;

exports.authHeaderValue = (accessToken) => [tknConfig.extract.prefix, accessToken].join(' ');

exports.testUserData = function () {
    const randTask = randTasks[Math.floor(Math.random() * randTasks.length)];
    const randPassword = randPasswords[Math.floor(Math.random() * randPasswords.length)];

    return {
        user: {
            username: `John-Doe_${count++}`,
            email: `john.doe${count}@mail-provider.com`,
            password: `${randPassword}`
        },
        task: {
            taskName: `${randTask}`,
            currentTaskPoints: 0,
            maximumTaskPoints: Math.floor(Math.random()*25) + 1
        }
    }
};

exports.faultyTestUserData = function () {
    const randTask = randTasks[Math.floor(Math.random() * randTasks.length)];
    const randPassword = randPasswords[Math.floor(Math.random() * randPasswords.length)];

    return {
        user: {
            username: `John-Doe_10`,
            email: `john.doe@mail-provider.com`,
            password: `${randPassword}`
        },
        task: {
            taskName: `${randTask}`,
            currentTaskPoints: '10',
            maximumTaskPoints: `0`,
        }
    }

}