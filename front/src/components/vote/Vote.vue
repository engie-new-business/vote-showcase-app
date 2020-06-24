<template>
<div>
    <div class="card mb-5 xl:mb-10">
        <h2 class="font-bold tracking-wide text-2xl mt-0 mb-6 text-primary block">
            Do you want to save the pandas ?
        </h2>
        <div>
           <p>Pandas aren't as targeted by poachers as other iconic species, like tigers and elephants, and their natural range is limited to the bamboo forests of China. In some ways, this has kept them out of the limelight. But it hasn't kept them out of danger.</p>

<p>It's estimated that there are about 1,600 pandas left in the wild. Although their population has been increasing in recent years, so has development in China. There are about 50 nature reserves across the 20 remaining habitats that can sustain the bamboo diet of pandas.</p>

        </div>
    </div>


    <div class="card">
        <h2 class="font-bold tracking-wide text-2xl mt-0 mb-4 text-primary block">
            Vote
        </h2>

    <div v-if="!!sendError" class="card z-20 mb-5 xl:mb-10">
        <h4 class="font-bold tracking-wide text-xl mt-0 mb-6 text-primary block">
            Seems like you got an error</p>
        </h4>
        <p>{{sendError.toString()}}</p>
    </div>

        <div v-if="!voting">
            <div class="flex">
                <a class="cursor-pointer m-2 py-2 px-4 flex-1 rounded-lg text-center text-white hover:opacity-50 transition-all font-medium tracking-wide hover:text-white transition-all border-1 bg-green hover:bg-green" v-on:click="vote(true)">Yes</a>
                <a class="cursor-pointer m-2 py-2 px-4 flex-1 rounded-lg text-center text-white hover:opacity-50 transition-all font-medium tracking-wide hover:text-white transition-all border-1 bg-red hover:bg-red" v-on:click="vote(false)">No</a>
            </div>
        </div>

        <div v-if="voting && !sendError" class="my-10 py-6 h-20 overflow-hidden">
            <div class="loader">
                Loading...
            </div>
        </div>

        <div class="mt-4">
            <h2 class="font-bold tracking-wide text-2xl mt-0 mb-4 text-primary block">
                Results
            </h2>

            <div class="flex text-center">
                <div class="flex-1">
			Yes ({{yesCount}})
                </div>

                <div class="flex-none w-4/5 bg-red rounded-lg overflow-hidden">
                    <div class="flex">
                        <div class="fluentProgressBar-normal h-full text-left" v-bind:style="{ width: width +'%'}">
                        </div>
                    </div>
                </div>

                <div class="flex-1">
			No ({{noCount}})
                </div>
            </div>

	    <p v-if="!!txHash">
	    Transaction hash: <a v-bind:href="getEtherscanLink(txHash)" class="text-primary mb-4 block">{{txHash}}</a>
	    </p>

        </div>
    </div>
</div>
</template>

<script lang="ts" src="./Vote.ts" />
<style lang="scss" src="./Vote.scss" />
