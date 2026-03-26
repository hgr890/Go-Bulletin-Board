import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MessageSquare, Send, User, Clock, RefreshCw } from 'lucide-react';
import './index.css';

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

const App: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const fetchPosts = async () => {
        setFetching(true);
        try {
            const res = await fetch('/api/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setLoading(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });
            if (res.ok) {
                setTitle('');
                setContent('');
                fetchPosts();
            }
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-12 border-b border-slate-700 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-sky-500 rounded-2xl shadow-lg shadow-sky-500/20">
                            <MessageSquare className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Go Bulletin Board</h1>
                    </div>
                    <button
                        onClick={fetchPosts}
                        className={`p-2 rounded-full hover:bg-slate-800 transition-colors ${fetching ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5 text-sky-400" />
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                                <Send className="w-5 h-5 text-sky-400" />
                                新規投稿
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">タイトル</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="投稿のタイトル..."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-white placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1">本文</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="メッセージを入力してください..."
                                        rows={4}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-white placeholder:text-slate-600 resize-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-sky-500/20 active:transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? '送信中...' : '投稿する'}
                                    {!loading && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
                            投稿一覧
                            <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                                {posts.length}
                            </span>
                        </h2>

                        {posts.length === 0 && !fetching ? (
                            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                                <div className="inline-flex p-4 bg-slate-800 rounded-full mb-4">
                                    <MessageSquare className="w-8 h-8 text-slate-600" />
                                </div>
                                <p className="text-slate-500 font-medium">まだ投稿がありません。最初のメッセージを投稿しましょう。</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-slate-800/40 hover:bg-slate-800/60 p-6 rounded-3xl border border-slate-700 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                                                #{post.id}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-4">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                <span>匿名ユーザー</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{new Date(post.created_at).toLocaleString('ja-JP')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
