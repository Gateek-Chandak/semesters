const NewUpdates = () => {
    return ( 
        <div className="bg-[#f7f7f7] flex flex-col  h-fit min-h-full gap-2 px-10 pt-8">
            <h1 className="mb-6 text-muted-foreground text-sm">Last Updated April 20th, 2025</h1>
            <h1 className="text-3xl font-bold mb-4">New Features & Updates</h1>

            {/*  New Features Section */}
            <section className="mb-8 ml-4">
                <h2 className="text-2xl font-semibold mb-2">📅 Hours Studied Log - Term Page</h2>
                <p className="text-base leading-relaxed mb-4">
                    You can now track how many hours you&apos;ve studied <strong>per course, per day</strong>. Easily visualize your progress as the term goes by and stay consistent with your study goals.
                </p>

                <h2 className="text-2xl font-semibold mb-2">📈 GPA Estimator - Term Page</h2>
                <p className="text-base leading-relaxed mb-4">
                    A new GPA estimator is available on the term page! Predict your <strong>term and cumulative GPAs</strong> by including or excluding terms, and use a slider for each course to estimate your outcomes.
                </p>

                <h2 className="text-2xl font-semibold mb-2">📊 GPA Trend Graph - Home Page</h2>
                <p className="text-base leading-relaxed mb-4">
                    Visualize your academic journey with a trend graph that tracks your GPA over time.
                </p>

                <h2 className="text-2xl font-semibold mb-2">✅ Mark Term as Completed  - Term Page</h2>
                <p className="text-base leading-relaxed mb-4">
                    Declutter your dashboard by marking a term as completed. This hides old grading schemes, assessments, and study logs — and helps us scale more efficiently by reducing backend storage. 
                    <br /><span className="italic">Please mark past terms as complete to support future growth helping us reduce costs.</span>
                </p>
            </section>

            {/* Upcoming Features Section */}
            <h1 className="text-3xl font-bold mb-4">Coming Soon — Spring 2025</h1>
            <section className="mb-8 ml-4">
                <h3 className="text-xl font-semibold mb-2">🎧 Semesters Wrapped  - Term Page</h3>
                <p className="text-base leading-relaxed mb-4">
                    Inspired by Spotify Wrapped — get a personalized academic recap at the end of the term! You'll see highlights like hours studied, grades, deliverables completed, and more.
                </p>
                <h2 className="text-2xl font-semibold mb-2">💬 We&apos;d Love Your Feedback</h2>
                <p className="text-base leading-relaxed mb-4">
                    Got suggestions or feature requests? Fill out our quick <a href="https://forms.gle/V2twUiUaZUFKaMmMA" target="_blank" className="text-blue-600 hover:underline">Google Form</a> or email us at <a href="mailto:chandakgateek@gmail.com" className="text-blue-600 hover:underline">chandakgateek@gmail.com</a>.
                </p>
                <h2 className="text-2xl font-semibold mb-2">📢 Help Us Grow</h2>
                <p className="text-base leading-relaxed">
                    We&apos;re building this for every UW student — please share it with your friends, classmates, and whoever else!
                </p>
                <p className="text-lg leading-relaxed mb-4 font-medium mt-10">More exciting features are on the way — stay tuned!</p>
                <p className="text-lg leading-relaxed mb-4 font-medium mt-10">- Gateek C.</p>
            </section>
        </div>
     );
}
 
export default NewUpdates;