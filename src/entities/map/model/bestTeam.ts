export interface TeamMember {
    id: string;
    name: string;
    role: string;
    github: string;
    tg: string;
    lat: number;
    lng: number;
    avatarUrl: string;
    description: string;
    img?: string;
}

export const teamMembers: TeamMember[] = [
    {
        id: 'luiza',
        name: 'Луиза Хакиева',
        role: 'Team Lead / Frontend Developer',
        github: 'https://github.com/AmenEpistat',
        tg: 'https://t.me/pppr_mint',
        lat: 55.801,
        lng: 49.095,
        avatarUrl: 'https://avatars.githubusercontent.com/AmenEpistat',
        description: '',
        img: '/team/luiza-syeta.jpg',
    },
    {
        id: 'misha',
        name: 'Михаил Марфин',
        role: 'Frontend Developer',
        github: 'https://github.com/tenineee',
        tg: 'https://t.me/teninee',
        lat: 55.806,
        lng: 49.107,
        avatarUrl: 'https://avatars.githubusercontent.com/tenineee',
        description:
            'почти 21 годик, крашу кнопки и люблю бибизянок, сейчас зачиллился в Казанке) \n' +
            '\n' +
            'пиши, если вдруг появились какие-то вопросы!',
        img: '/team/misha.gif',
    },
    {
        id: 'alesha',
        name: 'Алексей Паршев',
        github: 'https://github.com/Alexs003',
        role: 'Backend Developer',
        tg: 'https://t.me/alexs003',
        lat: 55.801,
        lng: 49.1,
        avatarUrl: 'https://avatars.githubusercontent.com/Alexs003',
        img: '/team/alesha.jpg',
        description:
            '❝ Рецепт хорошего отдыха №1: лечь на травку, раскинуть крылья и лежать, лежать, лежать. ❞\n' +
            '\n',
    },
    {
        id: 'artur',
        name: 'Артур Сабирзянов',
        github: 'https://github.com/squ1ky',
        role: 'Backend Developer',
        tg: 'https://t.me/katharsysss',
        lat: 55.804,
        lng: 49.11,
        avatarUrl: 'https://avatars.githubusercontent.com/squ1ky',
        description: 'https://www.youtube.com/embed/aZWWlqDy8nE?rel=0',
    },
];
