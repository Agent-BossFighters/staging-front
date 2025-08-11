import { AgentLogo, A } from "@img/index";


export default function OpensourcePage() {
    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 p-4 pt-20 pb-10">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold">WHY</h2> 
                <img src={AgentLogo} alt="Agent Logo" className="h-8 sm:h-12 lg:h-20 w-auto pt-1 sm:pt-3 lg:pt-5" /> 
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold">IS OPEN SOURCE ?</h2>   
            </div>
            <div className="flex flex-col mx-auto w-5/6 max-w-5xl text-justify">
                <p className="">
                Agent is an open source company. That means our product's code is freely available for users to inspect, run and contribute to.
                </p>
                <p className="">
                But why open source ? Why give away something valuable for free ? 
                That's a fair question, as being open source seems to be at odds with running a successful company.
                </p>
                <p className="">
                When we started to build the product for a gaming community, we had a clear vision : make a product that is accessible, transparent, innovative and user first. Being open source allows us to accomplish that. Our decision to be open source wasn't a business move. Our motivation is deeply rooted in our core values, the product we want to develop, and the community we want to build.
                </p>
            </div> 

            <div className="flex flex-wrap justify-center mx-auto md:w-full w-5/6 gap-x-20 gap-y-16 mt-24 mb-20">
                <div className="flex flex-col md:w-2/6">
                    <div className="flex flex-row justify-center items-center mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-bold">
                            <img src={A} alt="A" className="w-14 lg:w-20 h-14 lg:h-20" />
                            CCESSIBLE
                        </h2>
                    </div>
                    <div className="flex flex-col text-justify gap-4 mx-2">
                        <p className="text-justify">
                        The product is designed not to exclude potential users. Whether digital, intellectual/cognitive or digital, our user-centered design aims at accessibility for all.
                        </p>
                        
                        <p className="text-justify">
                        Why should we recommend inclusion without doing it ourselves ?
                        </p>
                        
                        <p className="text-justify">
                        In this way, we can be sure of having a panel of users who will really be able to respond to the studios' problems, naturally, by giving importance and power to each “atom”.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:w-2/6">
                    <div className="flex flex-row justify-center items-center mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-bold">
                            TR
                            <img src={A} alt="A" className="w-14 lg:w-20 h-14 lg:h-20" />
                            NSPARENT
                        </h2>
                    </div>
                    <div className="flex flex-col items-center gap-4 mx-2">
                        <p className="text-justify">
                        Too many analytics products act like black boxes. You send your data in and you get back a chart or some data, but no idea how it was calculated, what assumptions were made, or where else that data is being used.
                        </p>
                        <p className="text-justify">
                        As a facilitator between community and studio, trust is essential. Our users need to know what's going on under the hood - how data is processed, how information is generated and how privacy is protected. Being open source allows our users to inspect the code and contribute patches and ideas. By being totally transparent, we can build lasting trust with our users.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:w-2/6">
                    <div className="flex flex-row justify-center items-center mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-bold">
                            INNOV
                            <img src={A} alt="A" className="w-14 lg:w-20 h-14 lg:h-20" />
                            TIVE
                        </h2>
                    </div>
                    <div className="flex flex-col items-center gap-4 mx-2">
                        <p className="text-justify">
                        Innovation rarely happens in insolation. By making open source we invite a global community of developers, analysts, 
                        business owners, and product engineers to help us improve our product — to build features we haven’t thought of,
                        fix bugs we haven’t caught, and tackle use cases we haven’t seen. 
                        That’s the beauty of open source: it turns users into collaborators. It allows users with unique problems to create 
                        unique solutions — and often share them back.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:w-2/6">
                    <div className="flex flex-row justify-center items-center mb-8">
                        <h2 className="flex items-center justify-center text-4xl font-bold">
                            <img src={A} alt="A" className="w-14 lg:w-20 h-14 lg:h-20" />
                            DVOCATE
                        </h2>
                    </div>
                    <div className="flex flex-col items-center gap-4 mx-2">
                        <p className="text-justify">
                        Generally companies gather feedback from their users to help drive their roadmap, 
                        but the decision ultimately ends up with the company. Users have very little actual influence over the product they use.
                        </p>
                        <p className="text-justify">
                        With our web3's features, we invite users to make a real impact in their community, 
                        so that it grows and helps the studio in its player-first approach.
                        </p>
                    </div>
                </div>
            </div>    

        </div>
    );
}