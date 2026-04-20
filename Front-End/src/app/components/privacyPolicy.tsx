import { useNavigate } from "react-router";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate("/signup")}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-orange-400" />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>

                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">1. Information We Collect</h2>
                            <p>
                                Citrus may collect basic information you enter such as your username,
                                email, and account details needed to use the site. We do not collect
                                your thoughts after losing a ranked match, although they are probably intense.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">2. How We Use Your Information</h2>
                            <p>
                                We use your information to support account creation, login, cart activity,
                                and other core features of the Citrus experience. We do not use your data
                                to summon mysterious sales at 3 AM, even if it feels that way.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">3. Sharing of Information</h2>
                            <p>
                                We do not intentionally share your personal information with random strangers,
                                evil wizards, suspicious pigeons, or underground game resellers. Any sharing
                                that does happen should be related only to project functionality and development.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">4. Cookies and Tracking</h2>
                            <p>
                                Citrus may use basic browser storage or similar tools to keep track of things
                                like your session or cart. These tools are here to help the site function and
                                not to judge your questionable taste in games.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">5. Data Security</h2>
                            <p>
                                We try to protect your information using reasonable safeguards for this project.
                                That said, no system is perfect, and the final boss of cybersecurity is still
                                undefeated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">6. Student Project Notice</h2>
                            <p>
                                Citrus is a class project, and some features may be partly simulated or still
                                in development. That means parts of the site may look more official than they
                                actually are, which is honestly a compliment to the design team.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">7. Your Choices</h2>
                            <p>
                                You can choose what information to provide, and you can avoid using the site
                                if you are not comfortable with its features. You can also choose not to buy
                                five games in one sitting, although history suggests that may be difficult.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}