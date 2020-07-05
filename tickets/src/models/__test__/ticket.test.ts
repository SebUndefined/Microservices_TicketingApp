import { Ticket } from '../ticket';

it('Implement optimistic concurrency control', async (done) => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'Super Ticket',
        price: 5,
        userId: '123',
    });

    // Save the ticket to the database
    await ticket.save();

    // Fectch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the ticket we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // Save the first fetched ticket
    await firstInstance!.save();
    // Save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error(' Should not reach this point');
});

it('Increment the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 34,
        userId: '123EE'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
});
