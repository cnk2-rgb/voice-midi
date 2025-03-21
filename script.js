// must run on http server
async function loadMidiFile() {
    try {
        const midi = await Midi.fromUrl("stravinsky_rite_of_spring.mid");
        console.log("MIDI file loaded:", midi.name);

        const synths = [];
        const checkbox = document.querySelector("input[name=checkbox]");

        checkbox.addEventListener("change", function () {
            if (this.checked && midi) {
                console.log("Checkbox is checked..");
                const now = Tone.now() + 0.5;
                midi.tracks.forEach((track) => {
                    //create a synth for each track
                    const voice_sampler = new Tone.Sampler({ 
                        baseUrl: 'sampler/',
                        urls: {
                          'A3': 'A3.mp3'
                        },
                        release: 1
                      })
                      
                    voice_sampler.toDestination()

                    // const synth = new Tone.PolySynth(Tone.Synth, {
                    //     envelope: {
                    //         attack: 0.02,
                    //         decay: 0.1,
                    //         sustain: 0.3,
                    //         release: 1,
                    //     },
                    // }).toDestination();
                    synths.push(voice_sampler);
                    //schedule all of the events
                    track.notes.forEach((note) => {
                        console.log(note);
                        voice_sampler.triggerAttackRelease(
                            note.name,
                            note.duration,
                            note.time + now,
                            note.velocity
                        );
                    });
                });
            } else {
                console.log("Checkbox is not checked..");
                while (synths.length) {
                    const synth = synths.shift();
                    synth.disconnect();
                }
            }
        });
    } catch (error) {
        console.error("Failed to load MIDI file:", error);
    }
}

// Call the function to load MIDI
loadMidiFile();