<template>
<div>
    <div class="flex flex-wrap items-start">
        <div class="flex flex-wrap items-baseline w-full xl:w-2/3 xxl:w-1/2 p-5 pb-0 xl:p-10 xl:pr-5">
            <div v-if="account" class="card z-20 mb-5 xl:mb-10">
                <h2 class="font-bold tracking-wide text-2xl mt-0 mb-4 text-primary inline-block">
                    Your signing account
                </h2>

                <div>Address: {{account}}</div>
            </div>

            <div v-if="deploying" class="w-full">
                <div class="loader">
                    Loading...
                </div>
            </div>

	    <div v-if="!web3" class="card mb-5 xl:mb-10">
		    <h2 class="font-bold tracking-wide text-2xl mt-0 mb-6 text-primary block">
			    Please install Metamask
		    </h2>

		    Please install Metamask to try this application. Metamask can be found <a class="text-primary" href="https://metamask.io/">here</a>
	    </div>

            <Vote
		    v-if="account && web3"
		    class="z-20 mb-5 xl:mb-10"
		    v-bind:account="account"
		    v-bind:web3="web3"
		    v-bind:contractAddress="voteContract"
		    v-bind:backend="backend"
	    />
        </div>

        <div class="flex flex-wrap items-center w-full xl:w-1/3 xxl:w-1/2 p-5 xl:p-10 xl:pl-5 xxl:flex-col">
            <div class="card z-20 xl:max-w-lg">
                <h2 class="font-bold tracking-wide text-2xl mt-0 mb-6 text-primary inline-block ">
                    Neep help?
                </h2>
                <a href="https://rockside.gitbook.io/rockside/" class="text-primary mb-4 block">
                    <i class="fas fa-book mr-4 opacity-75" />
                    Read documentation
                </a>

                <a href="https://rockside.io/about" class="text-primary mb-4 block">
                    <i class="fas fa-address-card z-20 mr-4 opacity-75" />
                    About us
                </a>

                <a href="mailto:contact@rockside.io" class="text-primary block">
                    <i class="fas fa-paper-plane mr-4 opacity-75" />
                    Contact us
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script src="./metamask.ts" lang="ts" />
