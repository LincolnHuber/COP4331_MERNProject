import { useNavigate } from "react-router";
import { ArrowLeft, ScrollText } from "lucide-react";

export function TermsOfService() {
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
                        <ScrollText className="w-8 h-8 text-orange-400" />
                        <h1 className="text-4xl font-bold">Terms of Service</h1>
                    </div>

                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">1. Project Use</h2>
                            <p>
                                Citrus is a class project storefront experience. By using this site, you agree
                                to use it responsibly and understand that some features may be simulated for
                                demonstration purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">2. Account Responsibility</h2>
                            <p>
                                You are responsible for the information you enter on this site and for keeping
                                your account details secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">3. Purchases</h2>
                            <p>
                                Purchases shown in the current demo may not represent real financial transactions
                                unless otherwise stated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">4. User Conduct</h2>
                            <p>
                                You agree not to misuse the platform, spam the site, or do anything that would
                                break functionality for other users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">5. Limitation of Liability</h2>
                            <p>
                                Citrus is not responsible for lost sleep, neglected chores, unfinished homework,
                                or your steadily growing game backlog.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-2">6. Additional Important Notes</h2>
                            <p>
                                Refunds for emotional damage after difficult boss fights are not available.
                                Side effects of using Citrus may include impulsive browsing, saying “just one more game,”
                                and suddenly having no storage space left.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}