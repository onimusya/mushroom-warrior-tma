import React from 'react';

const RankTable = () => {
    const rankings = [
        { rank: 1, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '👑' },
        { rank: 2, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🔵' },
        { rank: 3, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🛡️' },
        { rank: 4, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🟣' },
        { rank: 5, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649, icon: '🟤' },
        { rank: 6, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
        { rank: 7, player: 'Tom', game: 17602649, referral: 17602649, total: 17602649 },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Rank</th>
                        <th className="py-3 px-6 text-left">Player</th>
                        <th className="py-3 px-6 text-right">Game</th>
                        <th className="py-3 px-6 text-right">Referral</th>
                        <th className="py-3 px-6 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {rankings.map((rank, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                {rank.icon ? (
                                    <span className="text-2xl">{rank.icon}</span>
                                ) : (
                                    <span className="font-medium">{rank.rank}</span>
                                )}
                            </td>
                            <td className="py-3 px-6 text-left">{rank.player}</td>
                            <td className="py-3 px-6 text-right">{rank.game.toLocaleString()}</td>
                            <td className="py-3 px-6 text-right">{rank.referral.toLocaleString()}</td>
                            <td className="py-3 px-6 text-right">{rank.total.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="more-rank-button">
                More Rank List
            </button>
        </div>
    );
};

export default RankTable;