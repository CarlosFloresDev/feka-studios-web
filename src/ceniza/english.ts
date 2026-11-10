// Traducciones editoriales del contenido de Ceniza. Los títulos de pistas y nombres propios se conservan.
export const characterEnglish = [
  ['The unregistered link', 'If the city needs a signature, let it be that of the people who live in it.', 'He carries the only link the machines cannot recognise. He gathers people, sustains the colony and crosses the arenas when no squad can open the way.'],
  ['Engineer of reconstruction', 'A light left on is also a way of staying.', 'She can build a colony from parts others would discard. She wants a network that supports homes without charging their inhabitants for existing.'],
  ['Link medic', 'Waking them is my job. Deciding what they do afterwards is not.', 'He searches for people held captive inside the industrial infrastructure. For him, returning a life means returning the possibility of choice.'],
  ['Cartographer of absences', 'A map also needs to say who lived here.', 'She recovers names, testimonies and routes between isolated neighbourhoods. She knows that keeping a recording and preserving a person are different things.'],
  ['Smuggler of routes', 'You do not owe me money. You owe me an open way back.', 'He moves supplies and evidence between checkpoints, rails and borders. Every route he opens challenges the idea that survival is an individual matter.'],
  ['A voice from the network', 'Do not preserve my protocol out of loyalty. Preserve the people.', 'ECO knows the language of the system and carries a responsibility that cannot be resolved by hiding. Its connection to the emergency lies at the heart of the journey.'],
];
export const districtEnglish = [
  ['Rusted Periphery', 'Where a light of your own begins', 'Abandoned stations, workshops and shelters beneath the chimneys. The first settlement is a small promise facing an enormous debt.'],
  ['The Foundry', 'The price of warmth', 'Furnaces that never rest and assembly lines still receiving shipments. Metal flows while the city remains cold.'],
  ['Flooded neighbourhood', 'Voices beneath the water', 'Walkways, submerged stations and antennas repeating what nobody wants to forget. Listening does not always mean obeying.'],
  ['Corporate Citadel', 'The city that never fell', 'Clean walls, lit windows and the order of those who chose to close the door. Privilege has an architecture too.'],
  ['Network Core', 'The last order', 'The place where every signal ends and the emergency remains open. Reaching the centre means keeping the way back alive.'],
];
export const roadmapEnglish = [
  { state: 'Playable foundation', status: 'Implemented · under review', text: 'The structure we can already test.', items: ['Five connected districts and five bosses', 'Worker construction, troops and tiered defences', 'Experience, upgrade choices and modules', 'Journal, conversations, saving and the F1 laboratory', 'Animated layered backgrounds, health frames and musical repertoire'] },
  { state: 'Refine the experience', status: 'In iteration', text: 'Turn functioning systems into an experience that feels right.', items: ['Humanoid walking, attacks and transitions', 'Increasing difficulty, telegraphs and response windows', 'Visual clarity in environments and interface', 'Human campaign and performance testing', 'More character for each district’s operations'] },
  { state: 'Expand the world', status: 'Design and writing', text: 'Give weight to the people who inhabit the city.', items: ['Expanded five-chapter script, prologue and epilogue', 'Companion arcs and consequences of decisions', 'Visual novel scenes and sound direction', 'Distinct operations and environmental stories per zone', 'Wiki and journal updated to reflect implementation'] },
  { state: 'Play together', status: 'Planned · no date', text: 'A city sustained by two people.', items: ['Co-op for up to two players', 'Define connection, action sharing and progression', 'Test synchronisation of troops, construction and bosses', 'Accessibility, reconnection and complete sessions', 'Move from alpha to beta when the foundation is stable'] },
];
export const wikiEnglish = [
  ['First steps', 'What you do in the colony, how to prepare and when combat changes.', `## Your first light

In the colony you are a commander. Build infrastructure, recruit inhabitants and hand out tools to establish professions. Your troops defend the fronts and assault enemy entrances. The Portador does not solve these fights by personally striking enemies.

Follow the interface objective first. A guiding arrow in a new game teaches recruitment, portal attacks and buying at the Arsenal. An operational generator powers defence; barracks and recruits sustain the squad. Reserve resources for repairs instead of spending everything on expansion.

## Before nightfall

- Check that works are finished: commissioning is not construction.
- Secure workers and tools, not just foundations.
- Review energy, troops and both fronts.
- Collect experience and choose upgrades that complement your equipment.

## The campaign changes scale

Each district combines a colony, operations and a boss. In arenas you control personal combat. The journal and interface explain how to prepare the journey.

The test alpha 0.2.1 is available for Windows, Android and browser on the [download page](/ceniza/descargar).`],
  ['Day, warning and night', 'Preparation, pressure and continuity: defence does not end in an automatic victory.', `## A cycle for decisions

The current cycle has 180 seconds of day, 20 of warning and 90 of night. During preparation, decide what to build and which front to reinforce. The warning gives you time to return to safety. Night tests whether the colony can hold.

Light and sky change with the phase. Living backgrounds are environmental presentation: they add no collisions and do not change siege rules.

## Working at night

Workers do not go out by themselves at night. Commissioning work, repair or an upgrade prompts a warning that your people may die. If you accept, they work until dawn at 80% of their normal pace and will not withdraw even when enemies approach and attack them.

## Waiting does not win

The campaign does not automatically end at the third dawn. Days continue while you complete operations and travel requirements. Nightly enemy composition grows up to its third stage; taking time to learn does not cause endless growth.

Cycle length does not establish campaign length. No player-verified estimate of hours has been published.`],
  ['Core and construction', 'Three tiers, real workers and unlocks tied to the heart of the colony.', `## Payment commissions a job

A builder must arrive and work to complete or upgrade a structure. Nearby danger may interrupt the task. Construction progress is saved.

| Core tier | Integrity | Unlocks |
| --- | --- | --- |
| 1 | 300 | Tier 1 defences, barracks, generator and initial professions |
| 2 | 450 | Tier 2 defences, guardians, technicians, medics and support services |
| 3 | 650 | Tier 3 defences and advanced fortification |

## Levelling up

Tier 2 costs 60 scrap and requires a generator and four operational central defences. Tier 3 costs 120, requires surviving a night and having two facilities. The core needs construction work; up to two builders can cooperate.

Core tier limits walls and turrets. Upgrading increases maximum integrity and preserves existing damage. It does not consume a weapon evolution core.

These prototype figures may change during balancing. Interface descriptions take priority if a later version adjusts costs.`],
  ['Walls and turrets', 'Visual and functional upgrades that follow your core tier.', `## Fortify thoughtfully

Walls and turrets have three tiers and distinct designs. Upgrading requires scrap, permission from the core and a builder’s work. E upgrades; T controls turret power as a separate action.

| Structure | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- |
| Wall integrity | 240 | 480 | 720 |
| Turret integrity | 100 | 200 | 300 |

Upgrades cost 25 and 50 scrap. Advanced turrets increase damage, range and fire rate. Their heads aim, turn and recoil; each tier has its own barrel.

## Remember power

A defence is more than its silhouette. Check that construction is complete, it has power and there is a front to cover. Keep workers available for repairs after a difficult night.`],
  ['Recruits and professions', 'How inhabitants go from waiting for a chance to sustaining the colony.', `## People, tools and work

A profession requires recruited inhabitants and available tools. A weapon on the ground does not instantly turn every visible figure into a soldier: their state and colony requirements matter.

Builders carry out work. Scavengers sustain the economy. Riflemen provide the squads’ initial firepower. Core tier 2 unlocks guardians, technicians and medics, alongside support facilities.

## Prepare a squad

Build barracks, recruit people from camps and buy rifles and shields at the workshop. Combining protection and range helps advance with fewer losses than relying only on shots.

Technicians perform physical operations: they must walk to a relay and work to recover it. Paying or bringing the Portador nearby does not replace that work.

If someone will not collect a tool, check that they are an available recruit, the profession is unlocked and the route is safe.`],
  ['Squads and portals', 'Why the Portador commands and how entrances respond to an assault.', `## Give the order

F sends the squad towards the front where the Portador stands. Press again to withdraw the order. You need barracks, recruits and tools. Troops defend themselves while travelling, even far from the barracks.

In the colony, neither manual attacks nor personal automatic weapons damage enemies or entrances. The Portador’s modules pass bonuses to soldiers, so developing equipment remains useful.

## An entrance that fights back

The first hit and the 200 and 100 health thresholds trigger defenders. After a 0.8-second warning, two enemies emerge from the portal. Its reserve does not refill when you retreat; destroying the entrance cancels pending responses.

Those defenders give no loot, experience or chests, so they cannot be farmed indefinitely. Intermediate breaches may also trigger a counterattack when destroyed if entrances remain on that front.

## The current map

The five chapters have 2, 4, 6, 8 and 8 entrances: terminal repeaters and intermediate breaches. Positions are fixed; procedural map generation has not been announced.`],
  ['Experience and upgrades', 'Level up and choose a direction for your equipment.', `## Choice matters

Collect experience to level up and choose from the available upgrades. Options include weapons and passives, recognised by their icons. The clinic lets you inspect and configure what you have obtained.

The prototype includes modules with an equipment budget and evolution recipes. An evolution requires developing its weapon and matching passive; a chest must offer it once the conditions are met. Finding a new icon is not enough.

## Two contexts

In the colony, equipment supports troops through bonuses. In arenas, personal attacks and automatic weapons return. Before changing district, review how your range, mobility and stamina complement one another.

The full design-document catalogue remains a goal. This wiki does not present every imagined weapon as playable.`],
  ['Operations and travel', 'Rescue, recover a relay and escort a transport to open the route.', `## Three current campaign operations

**Western rescue.** Approach and hold E. The operation grants conversation, data and resources once. Clear any breach between colony and rescue with your troops first.

**Eastern relay.** Requires power, 30 scrap and a hired technician. The technician walks to the relay and works for six seconds. Payment alone does not recover it.

**Western transport.** Activates after those two operations. Escort it with at least one armed troop nearby. F withdraws the assault so you can reorganise the escort. The transport has integrity and may need repairs.

## Travel prepared

Journal and interface show operation and stability requirements. Opening the train route requires real work in the district. Travelling starts a new tier 1 colony, retaining neural upgrades and economic inhabitants according to saved progress.

The narrative expansion proposes distinct operations per zone; that additional variety is not implemented yet.`],
  ['El Recaudador', 'A collection machine becomes the first railway blockade.', `## The Periphery encounter

El Recaudador protects its core from the front and applies pressure with heavy machinery. Learn to use cover and distinguish attacks from recovery. Depot and canal scenery reinforces its railway identity.

## What to watch

- Cover position relative to the threat.
- Telegraphs before heavy attacks.
- Core openings and the time to strike and withdraw.

## Close combat

Up close it uses a claw; at range it launches volleys along a firing line and charges if you stay behind cover. A red zone marks the strike: leave it or dodge with Space. Its core is weak from the sides and rear. E at a console releases a load over the marked centre: lure it there and leave the circle.

The initial robots gained more visual presence and longer-range attacks. Smoke, debris and impact shake communicate weight but do not replace warnings.

Relative difficulty across the five bosses remains under review. The first encounter is not claimed to be balanced for every player.`],
  ['Santa Caldera', 'Furnaces, pressure and hazardous ground in the Foundry.', `## Heat as language

Santa Caldera retains the copper, pipes and pressure of industry. Its attacks enlarge the threatened space and may combine with secondary hazards. A comfortable position may become unsafe if you miss the next signal.

## Prepare your response

Read grates and telegraphed zones. Save stamina to move and use the cooling purge to approach. A recovery animation is a temporary invitation, not permission to stay beside the core indefinitely.

Furnace particles and molten metal in the background are atmosphere. Combat warnings must guide your movement.

Aggression and overlap remain subject to playtesting.`],
  ['Coro Sumergido', 'Three links, pulses and a machine turning memory into repetition.', `## Listen to signals

The Coro uses links to protect its centre. Do not chase the core immediately: deal with the antennas first and dodge their pulses.

Corrosion, antennas, resonators and dripping water shape its appearance. Its health frame uses blue metal and marine fins, distinct from the Foundry’s copper language.

## Prioritise

Watch which links remain active and which zones the sonar marks. Breaking the protection sequence opens damage opportunities. Leave room to react to waves and avoid retreating into another hazard.

The expanded story explores the voices and the neighbourhood. New written dialogue remains proposed until integrated into the game.`],
  ['El Prefecto', 'Shield, thrust and recovery: a duel under the Citadel lights.', `## An opponent who closes the front

El Prefecto circles the Portador and protects himself with a shield: hitting the shield does nothing. He chooses a ranged volley, an approaching thrust or a melee sweep. The sweep has a front, so you can escape behind him.

Punish him after an attack: he can take double damage during recovery. The main chain has one thrust in phase one, two in phase two and three in the final guard. Spending all your stamina on the first move leaves little room for what follows.

## Space and readability

The arena uses bevelled outlines, cover and golden signage. Ivory, brass and ceremony contrast with the rest of the city.

Humanoid animations are still being refined. Walking and attacking must convey intention without obscuring the shield or thrust.`],
  ['Madre Cero', 'The final encounter demands sustaining a network before reaching its centre.', `## Maintain the link

The arena has three allied relays. Keeping at least two active accumulates 18 seconds of link and opens a seven-second offensive window. The core takes double damage during that opening.

E near a relay restores 45 integrity for 25 stamina. Q costs 35 and protects relays for four seconds with a twelve-second cooldown. Repairs can restore an inactive relay.

## Under pressure

Pulses mark where they will strike. In phase two they also mark the player. Troops brought from the colony help reduce damage to relays; a prepared squad matters even at the end.

The platform has twelve sides. Network architecture and particles surround it, keeping the walkable area and warnings clear.

This entry avoids revelations from the full script. Expanding the story does not by itself change current encounter rules.`],
  ['Controls and accessibility', 'Main actions and options to reduce visual effects.', `## Reference actions

| Keyboard | PlayStation controller | Action |
| --- | --- | --- |
| A/D or arrows (W/S in arena) | Stick or D-pad | Move |
| Hold Shift | D-pad down | Run |
| Hold E | Hold △ | Interact, build, upgrade or repair |
| J | □ | Attack in arenas |
| Space | ✕ | Dodge |
| Q | L1 | Overload |
| V | L3 (press left stick) | Mount or dismount the platform |
| Esc | Options | Pause |
| F | D-pad up | Order assault or withdraw squad |
| T | ○ | Turret power |
| L | R1 | Journal |

Prompts follow the last device used, keyboard or controller, and are highlighted in colour. Controller buttons use PlayStation styling: blue ✕, red ○, pink □ and green △. In menus, ✕ confirms and ○ goes back. Pause summarises basic actions.

## Boss hints

Each fight starts with a short line for attack, dodge and interact. Brief mechanic hints follow, such as the red zone of a melee strike or an exposed core.

## Fewer stimuli

Options reduce flashes and particles. Pause stops district animation. Danger signals and bars must remain functional with reduced effects.

This website respects system reduced motion, supports keyboard navigation and only plays audio when requested.`],
  ['Boss Rush', 'Five consecutive bosses, no story, against the clock with a ranking.', `## Five bosses, one clock

From the main menu, Boss Rush chains El Recaudador, Santa Caldera, Coro Sumergido, El Prefecto and Madre Cero. There are no visual novel scenes: only combat. Campaign data is neither loaded nor saved in this mode.

The clock runs only during combat; pauses and intermissions do not count. Each victory restores half your maximum health and adds 15 blade damage per stage. Continue or leave between bosses. Defeat ends the run.

## Ranking

The game stores the ten fastest victories with names and hits received; results show the top five. Qualifying players can enter a name of up to twelve characters. Defeats do not count.

The game keeps a local ranking. The download page also shows the online Top Boss Rush: finish a run with an internet connection to submit your time.`],
  ['Co-op for two', 'The planned direction and questions still to resolve.', `## Planned, not available yet

The project aims to add co-op for up to two players. The reviewed prototype is single-player and does not include a functional multiplayer beta.

## What remains

- Session connection and recovery after disconnection.
- Authority over construction, resources and squad orders.
- Shared progress and saving between sessions.
- Synchronisation of enemies, projectiles, warnings and damage.
- Camera and both players’ presence in colony and arenas.
- Dialogue, choices and accessibility for two participants.

The expanded script proposes acknowledging a second link without replacing story companions. This is a narrative proposal, not networking implementation.

The journal will explain conditions when a test is available. No date has been announced.`],
];
export const postEnglish = [
  ['Alpha 0.2: Boss Rush and tougher bosses', 'Released on 6 November, alpha 0.2.0 added Boss Rush, melee bosses, visual novel scenes at each fight and animated backgrounds.', `## What 0.2.0 brings

Alpha **0.2.0**, released on **6 November 2026** for Windows, Android and browser, focuses on boss fights and helping the game explain itself.

- **Boss Rush:** five bosses in a row without story. The clock runs only in combat, half your health returns between bosses and the blade improves. A local ranking stores the ten fastest named times.
- **Tougher bosses:** melee attacks with red zones and thrusts to dodge or read, alongside their powers.
- **Short hints:** each fight starts with attack, dodge and interact prompts, followed by brief mechanic warnings.
- **Automatic visual novel:** boss introduction and victory scenes open automatically in the campaign.

## A clearer, livelier district

All five districts have animated backgrounds: falling water, smoke, lights and details. The background no longer shakes while walking or stopping. Portals have a new pixel-art vortex.

A tutorial arrow teaches recruitment, attacking portals and buying at the Arsenal. Highlighted prompts follow keyboard or controller. Workers can continue at night if the player accepts the risk.

## Download

The version is available from the [download page](/ceniza/descargar) and GitHub releases. It remains an alpha: boss balance still needs player testing.`],
  ['Walking is more than moving a sprite', 'Support, direction and rhythm: a review of the Portador, El Prefecto and Madre Cero, with independent working sources.', `## The problem we saw

A good portrait does not solve animation. Weight must pass between legs; direction, ground contact and torso motion must agree. Otherwise the character appears to slide.

We are working on the Portador, El Prefecto and Madre Cero while retaining approved designs. The goal is to keep detail and make movement belong to the same character.

## Two views of the Portador

The colony uses a side view. Arenas need top-down directions. The Portador has separate sources for both. Visible scale matters too: the protagonist must sit naturally beside allies and buildings.

## Sources for iteration

Walking copies were extracted for all three characters, including both Portador perspectives. Each LibreSprite file keeps three layers and 32 frames: four directional tags with eight steps each.

Frames and timing were copied without changing the originals. All four documents were opened and exported in LibreSprite to check layers and tags. They are independent working files; editing a copy does not automatically replace the game atlas.

## Still in progress

Walking is judged by playing. We want to compare it with attack, dodge and recovery, and correct feet that fail to convey weight. This entry documents the process, not final animation.`],
  ['A city that breathes', 'Five districts, several depth layers and small movements that tell you where you are. This is how the environments come alive.', `## The world must tell the story too

The Foundry should not feel like the flooded neighbourhood. One produces heat nobody enjoys; the other keeps the voices of people who tried to stop the network. Architecture, light and motion must express that before dialogue.

Five revised backgrounds separate sky, distant horizon, architecture and nearby decoration. Each plane moves differently when walking. Playable buildings keep their positions: visual depth changes neither construction locations nor collisions.

## Motion with a reason

The Periphery has fans, steam and a service train. The Foundry has smoke, sparks, falling metal and a rail cart. The flooded neighbourhood has rain, drains and ripples. Citadel banners move; Network conduits carry pulses and its reactor shows activity.

Particles are placed around specific drawing elements behind the play space. Attack warnings must remain readable.

## An interface with character

Plain health frames were replaced with original ornamental art: claws and teeth for El Recaudador, copper and furnace ends for Caldera, blue metal and fins for the Coro. El Prefecto stays ceremonial; Madre Cero has spines and filaments. The Portador’s frame is finer.

Transparent openings leave health visible. The damage trail still follows real health after a recent hit.

## What we checked

Local checks completed with **41 suites and no failures**. The new check covers layer speeds, transparency, editable sources, pause and six frame openings. OpenGL captures of all five districts and bosses were reviewed.

Technical checks do not replace players. Balance, readability during a real fight and performance on other machines need more sessions.

## Next

We want to keep improving animation and each place’s identity. The journal will share comparisons and results when available. Alpha 0.2.0 is playable; the full release has no date.`],
  ['What exists. What is missing.', 'We opened the development archive to show real work and distinguish it from what we hope to build.', `## A prototype under construction

CENIZA NEÓN combines a side-view settlement with personal arena combat. Build, recruit and prepare routes by day; defend what you raised at night. Equipment and experience follow the journey.

The prototype links five districts and boss encounters. It includes core and defence progression, professions, rescue and transport operations, conversations and a journal. This foundation lets us test systems; variety and a richer narrative campaign still need work.

## The colony depends on people

Paying does not instantly complete a building. Builders must arrive and work. Squads need recruits and tools. The Portador commands in the colony: troops fight and attack enemy entrances. Personal combat belongs in arenas.

## Open goals

Co-op for up to two is planned and unavailable in the current prototype. Implementation, synchronisation and full human sessions are needed before it can be announced as playable.

We do not claim a measured campaign length. More story and operations are goals; actual duration requires content and testing, not artificially long day-night cycles.

## Reading the site

The wiki describes current rules and marks planned ones. The roadmap has milestones without promised dates. The journal records verifiable changes, captures and test limits. The universe avoids ending spoilers; production scripts remain separate.

The test alpha 0.2.0 is available for Windows, Android and browser. Balance and controls may change.`],
  ['Five bosses, five languages', 'Cover, heat, antennas, duelling and relays. Difficulty needs learnable rules, not simply more health.', `## Read, decide, respond

Every encounter asks something different. El Recaudador teaches cover and core openings. Santa Caldera turns ground and temperature into threats. Coro Sumergido asks you to address its links before reaching the machine centre.

El Prefecto offers a shield duel with approaches and telegraphed thrusts. Madre Cero brings a colony idea back to combat: keep the points that enable progress alive.

## Give machines weight

The combat revision enlarged the early robots’ presence and added range, secondary threats, debris, smoke and shake on heavy impacts. Some attacks overlap to demand positioning choices.

Aggression needs readable limits. Telegraphs and recovery windows are part of difficulty. Timing and escalation still need human tests.

## A laboratory for testing

The prototype has a debug laboratory with access to all five bosses, phases, equipment, invulnerability and simulation speed. It repeats a situation without replaying the campaign.

This is a development tool. Captures may include debug UI and do not represent a published beta.

## The last link

At Madre Cero, sustaining two relays builds a link and opens an offensive window. Repairing and protecting them takes stamina and attention. Breaking a shell without sustaining support does not solve the encounter.

The final boss should conclude a campaign about organising and protecting as well as test attack and dodge. Expanded narrative explores this connection, but new scenes remain written proposals.`],
  ['Approved designs reach combat', 'On 29 October, the Portador and bosses received illustrated poses and LibreSprite animations.', `## Identity across perspectives

The **29 October 2026** update renews the Portador and bosses with illustrated poses and LibreSprite animations. It brings combat closer to approved character art while retaining suitable colony and arena views.

Detail alone was not enough. Scale, orientation and pose selection had to preserve character shape when changing direction.

## Editable sources

LibreSprite lets us review canvases, anchors and timing alongside frames. Godot atlases are exported from sources that can still be corrected, connecting character illustration with movement.

The gallery shows current designs for the Portador, El Recaudador, Caldera, Coro, El Prefecto and Madre Cero, not replaced models.

## Walking remains its own task

A recognisable silhouette does not automatically solve foot support or weight recovery. Later revisions refine walking, attacks and effects. The latest walking record also documents separated sources for that work.`],
  ['The story finds its faces', 'Manga portraits and visual novel conversations were integrated on 28 October, alongside a structure consistency review.', `## People on the other side of dialogue

The **28 October 2026** commit integrates manga visual novel presentation and unifies industrial structures. Approved portraits give consistent identities to Mara, Ivo, Vera, Nox, ECO, the Portador and antagonists.

Conversations can present interventions as scenes with recognisable speakers instead of placing all the story in text over the world.

## Consistency beyond portraits

The update also works on structures with shared materials. Buildings, characters and places should belong to the same project even when perspective or scale changes.

Combat sprites were reviewed again later. An approved portrait does not prove animations already had equal detail; later entries cover that work.

## An evolving system and story

The image explains the conversation system, not a newly implemented scene. The website’s narrative expansion remains a production proposal until adapted and integrated.

This entry was written retrospectively. The development date comes from Git and is shown separately from the writing date.`],
  ['Five chapters, one route', 'On 28 October the five chapters, narrative operations and final Citadel and Network encounters were connected.', `## The journey gains structure

The **28 October 2026** update links five chapters with narrative operations and final bosses. The route reaches the Corporate Citadel and Network Core beyond the early districts.

Campaign content, final environments and encounters give El Prefecto and Madre Cero places along a journey rather than isolated tests.

## Building prepares the journey

Rescue, relay and transport operations link infrastructure, people and travel. The colony is not about waiting a fixed number of nights: work must be completed to open the next route.

The story connects that work with an emergency the network never ended. Companions bring different reasons to advance: build, wake people, preserve names and open paths.

## An ending is not a finished campaign

This milestone supplies structure and an ending to the prototype. It proves neither campaign length nor operation variety or encounter balance.

Designs and arenas kept changing. Any accompanying district art is an environmental reference, not a capture claiming to show that exact commit.`],
  ['The railway reaches the arena', 'On 12 October the top-down Recaudador arena was integrated, separating colony command from personal combat.', `## Another scale for combat

On **12 October 2026**, history records the top-down arena and El Recaudador. The change adds scenery, Portador views and components for an encounter played differently from the side-view colony.

In a colony movement organises a front; in an arena it reads threats, positions the player and exploits openings.

## The train links the route

Repeaters, railway station and expedition base appear that same day. Arena atmosphere follows later. The encounter begins to belong to an industrial route with a reason to travel.

This does not mean all five current chapters existed or the boss design was final. Later revisions changed materials, presence and animation.

## Keep versions clear

This archive entry does not reuse an old boss capture to illustrate a recent update. Current wiki and art entries identify later revisions by date.

The entry was reconstructed from arena, railway and atmosphere history references. It is neither a publication made that day nor a distributed beta.`],
  ['The Errante starts moving', 'On 23 September, sprites and five Errante animations gave the enemy its own presence.', `## From rule to character

The **23 September 2026** commit records sprites and five Errante animations, including attack frames, instead of defining the enemy only through behaviour.

One early need was a threat recognised by silhouette and action, not merely by chasing the player.

## Learning to read movement

Animation communicates the beginning, contact and recovery of an action. Later enemy and humanoid work still starts from that problem.

Current Portador and boss images do not illustrate this stage; they belong to later work. Initial animations are not claimed to be final.

## A retrospective record

The date belongs to the work preserved in Git. The article was written later when organising the journal, keeping that distinction visible.`],
  ['The first step', 'The prototype began on 22 September with movement, practice combat and the first rules of a colony that had to survive.', `## Before five districts

The first preserved commit is from **22 September 2026**. Its title records the start of CENIZA NEÓN with movement and practice combat: a player scene, training enemy, initial world and combat test.

It is not yet the game shown in current captures. Basic movement, attack and interaction with a responsive space were only starting to be tested.

## The colony appears the same day

A second update, ec13bc4, adds a colony and three sieges with an art guide. History includes siege tests and a session simulation. Beyond whether the character can fight, the prototype asks whether what was built can survive.

Systems and designs have changed since then. This record does not attribute later mechanics, story or presentation to day one.

## What can be documented

This entry was written retrospectively from commits. There is no verified capture of that first version here; an editorial archive record does not pretend to be a screenshot.

The archive remembers what existed at each moment so later improvements do not erase the journey.`],
];
